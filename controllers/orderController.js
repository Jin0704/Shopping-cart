require('dotenv').config()

const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const User = db.User
const Product = db.Product
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const redis = require('../redis')
const yup = require('yup')
// let mailer = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: "OAuth2",
//     user: process.env.GMAIL_ACCOUNT,
//     pass: process.env.GMAIL_PASSWORD,
//     clientId: process.env.GOOGLE_OAUTH_ID,
//     clientSecret: process.env.Google_OAuth_PASSWORD,
//     refreshToken: process.env.refresh_token,
//     accessToken: process.env.access_token
//   }
// })

const URL = process.env.URL
const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const PayGateWay = "https://ccore.spgateway.com/MPG/mpg_gateway"
const ReturnURL = `${URL}/orders/spgateway/callback?from=ReturnURL`
const NotifyURL = `${URL}/orders/spgateway/callback?from=NotifyURL`
const ClientBackURL = `${URL}/orders`


//取得交易字串物件並轉換成字串
function genDataChain(TradeInfo) {
  let results = []
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`)
  }
  return results.join('&')
}

//將字串進行加密(用AES加密法)
function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
  let enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex')
  return enc + encrypt.final('hex')
}

//將字串雜湊
function create_mpg_sha_encrypt(TradeInfo) {

  let sha = crypto.createHash('sha256')
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

  return sha.update(plainText).digest('hex').toUpperCase()
}


function create_mpg_aes_decrypt(TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
  decrypt.setAutoPadding(false)
  const text = decrypt.update(TradeInfo, 'hex', 'utf8')
  const plainText = text + decrypt.final('utf8')
  const result = plainText.replace(/[\x00-\x20]+/g, '')
  return result
}

function getTradeInfo(Amt, Desc, email) {

  // console.log('===== getTradeInfo =====')
  // console.log(Amt, Desc, email)
  // console.log('==========')

  data = {
    'MerchantID': MerchantID, // 商店代號
    'RespondType': 'JSON', // 回傳格式
    'TimeStamp': Date.now(), // 時間戳記
    'Version': 1.5, // 串接程式版本
    'MerchantOrderNo': Date.now(), // 商店訂單編號
    'LoginType': 0, // 智付通會員
    'OrderComment': 'OrderComment', // 商店備註
    'Amt': Amt, // 訂單金額
    'ItemDesc': Desc, // 產品名稱
    'Email': email, // 付款人電子信箱
    'ReturnURL': ReturnURL, // 支付完成返回商店網址
    'NotifyURL': NotifyURL, // 支付通知網址/每期授權結果通知
    'ClientBackURL': ClientBackURL, // 支付取消返回商店網址
  }

  // console.log('===== getTradeInfo: data =====')
  // console.log(data)


  const mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  const mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  // console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
  // console.log(mpg_aes_encrypt)
  // console.log(mpg_sha_encrypt)

  tradeInfo = {
    'MerchantID': MerchantID, // 商店代號
    'TradeInfo': mpg_aes_encrypt, // 加密後參數
    'TradeSha': mpg_sha_encrypt,
    'Version': 1.5, // 串接程式版本
    'PayGateWay': PayGateWay,
    'MerchantOrderNo': data.MerchantOrderNo,
  }

  // console.log('===== getTradeInfo: tradeInfo =====')
  // console.log(tradeInfo)

  return tradeInfo
}


let orderController = {

  getOrders: async (req, res) => {
    try {
      let data;
      data = await redis.getKey(`user${req.user.id}_orders`)
      if(data){
        return res.render('orders', { orders:data})
      }
      const user = await User.findByPk(req.user.id)
      const orders = await Order.findAll({
        where: { UserId: user.id },
        include: [{ model: Product, as: 'items' }]
      })
      data = orders.map(order => order.toJSON())
      await redis.setKey(`user${req.user.id}_orders`, JSON.stringify(data))
      return res.render('orders', { orders: data })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'個人訂單錯誤'})
    }
  },
  postOrder: async (req, res) => {
    try {
      const bodyShape = yup.object().shape({
        name: yup.string().required(),
        address: yup.string().required(),
        phone: yup.string().required(),
        shipping_status: yup.string().required(),
        payment_status: yup.string().required(),
        payment_method: yup.string().required(),
        amount: yup.number().required(),
        UserId: yup.number().required(),
      })
      const cart = await Cart.findByPk(req.body.cartId, { include: 'items' })
      if (!cart) {
        req.flash('error_messages', '購物車中沒有商品!')
        return res.redirect('back')
      }
      let input = req.body
      input.UserId = req.user.id
      await bodyShape.validate(input)
      const order = await Order.create({
        ...input
      })
      var results = []
      for (let i = 0; i < cart.items.length; i++) {
        // console.log(order.id, cart.id, cart.items[i].id)
        results.push(
          OrderItem.create({
            OrderId: order.id,
            ProductId: cart.items[i].id,
            price: cart.items[i].price,
            quantity: cart.items[i].CartItem.quantity,
            subtotal: cart.items[i].price * cart.items[i].CartItem.quantity
          })
        )
      }

      // let mailOptions = {
      //   from: process.env.GMAIL_ACCOUNT,
      //   to: process.env.GMAIL_ACCOUNT,
      //   subject: `${order.name} 您的訂單已成立`,
      //   html:
      //     `
      //   以下是您的訂單:
      //   <h1>訂購者:${order.name}</h1>
      //   <h1>總金額:${order.amount}元</h1>
      //   <h1>付款方式:${order.payment_method}</h1>
      //   <h1>付款狀態:${order.payment_status}</h1>
      //   <h1>出貨狀態:${order.payment_status}</h1>
      //   <br>
      //   <hr>
      //   `
      // }

      // mailer.sendMail(mailOptions, (error, info) => {
      //   if (error) console.log('Error:', error)
      //   // console.log('Email sent:', info.response)
      // })

      //async await
      const cartItem = await CartItem.findOne({ where: { CartId: cart.id } })
      // await cartItem.destroy()
      // await cart.destroy()

      await Promise.all(results)
      req.session.cartId = ''
      await redis.clearKey(`user${req.user.id}_orders`)
      await redis.clearKey("admin-orders")
      return res.redirect('/orders')
      //  Promise.all(results).then(() => {
      //   console.log('------------')
      //   console.log(cart)
      //   console.log('------------')

      // })
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'建立訂單錯誤'})
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, {})
      await order.update({
        shipping_status: '訂單取消',
        payment_status: '訂單取消',
      })
      await redis.clearKey(`user${req.user.id}_orders`)
      await redis.clearKey("admin-orders")
      return res.redirect('back')
    } catch (err) {
      console.log(err)
      return res.render('error',{err:'取消訂單錯誤'})
    }
  },
  getPayment: (req, res) => {
    // console.log('===Payment===')
    // console.log(req.params.id)
    // console.log('==========')

    return Order.findByPk(req.params.id, {})
      .then(order => {
        const tradeInfo = getTradeInfo(order.amount, '產品名稱', process.env.GMAIL_ACCOUNT)
        order.update({
          ...req.body,
          sn: tradeInfo.MerchantOrderNo
        }).then(order => {
          res.render('payment',
            {
              order: order.toJSON(),
              tradeInfo: tradeInfo
            })
        })
      })
  },
  spgatewayCallback: async (req, res) => {
    try {
      // console.log('=====spgatewayCallback=====')
      // console.log(req.method)
      // console.log(req.query)
      // console.log(req.body)
      // console.log('===========================')

      // console.log('=====spgatewayCallback: Tradeinfo======')
      // console.log(req.body.TradeInfo)

      const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

      // console.log('=====spgatewayCallback: create_mpg_aes_decrypt、data======')
      // console.log(data)
      let orders = await Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } })
      console.log('=====orders======')
      console.log(orders)
      await orders[0].update({
        ...req.body,
        payment_status: '已付款',
      })
      return res.redirect('/orders')
    } catch (err) {
      console.log(err)
    }
    // return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } })
    //   .then(orders => {
    //     orders[0].update({

    //     }).then(order => {
    //       return res.redirect('/orders')
    //     })
    //   })
  },
}

module.exports = orderController