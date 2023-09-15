require('dotenv').config()

const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const User = db.User
const Product = db.Product
const Payment = db.Payment
const PaymentMethod = db.PaymentMethod
const nodemailer = require('nodemailer')
const redis = require('../redis')
const yupCheck = require('../helper/yupCheck')
const newebpay = require('../helper/newebpayHelper')
const ComputeHelper =  require('../helper/compute')
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
const orderController = {

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
        include: [{ model: Product, as: 'items' },{ model: PaymentMethod, as:'methods'}]
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
      let cart = await Cart.findByPk(req.body.cartId, { include: 'items' })
      cart = cart ? cart.toJSON() : null
      if (!cart || !cart?.items.length) {
        req.flash('error_messages', '購物車中沒有商品!')
        return res.redirect('back')
      }
      let input = req.body
      input.UserId = req.user.id
      input.amount = await ComputeHelper.compute(cart)
      await yupCheck.orderShape(input)
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
      // const cartItem = await CartItem.findOne({ where: { CartId: cart.id } })
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
        const tradeInfo = newebpay.getTradeInfo(order.amount, '產品名稱', process.env.GMAIL_ACCOUNT)
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
  newebpayCallback: async (req, res) => {
    try {
      // console.log('=====spgatewayCallback=====')
      // console.log(req.method)
      // console.log(req.query)
      // console.log(req.body)
      // console.log('===========================')

      // console.log('=====spgatewayCallback: Tradeinfo======')
      // console.log(req.body.TradeInfo)
      // console.log('=====req.body',req.body)
      if(req.query.from =='ReturnUEL'){
        if(!req.body.Status=='SUCCESS'){
          return res.redirect('/orders')
        }
        console.log('付款成功')
        return res.redirect('/products')
      }
      if(req.query.from == 'NotifyURL'){
        const data = JSON.parse(newebpay.create_mpg_aes_decrypt(req.body.TradeInfo))
        let orders = await Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } })
        await orders[0].update({
          ...req.body,
          payment_status: '已付款',
        })
        await Payment.create({
          amount:data['Result']['Amt'],
          sn:data['Result']['MerchantOrderNo'],
          payment_method:data['Result']['PaymentMethod'],
          paid_at:new Date(),
          params:data['Result']['TradeNo'],
          OrderId: orders[0].dataValues.id
        })
        await redis.clearKey(`user${orders[0].UserId}_orders`)
        await redis.clearKey("admin-orders")
        return true
      }
    } catch (err) {
      console.log(err)
    }

  },
}

module.exports = orderController