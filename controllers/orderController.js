const { Promise } = require('mongoose')
const db = require('../models')
const Cart = db.Cart
const Order = db.Order
const OrderItem = db.OrderItem
const nodemailer = require('nodemailer')

let mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 's87160204@gmail.com',
    pass: ''
  }
})


let orderController = {

  getOrders: (req, res) => {
    Order.findAll({
      raw: true,
      nest: true,
      include: 'items'
    }).then(orders => {
      console.log(orders[0].items)
      return res.render('orders', {
        orders: orders
      })
    })
  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount
      }).then(order => {

        var results = []
        for (let i = 0; i < cart.items.length; i++) {
          console.log(order.id, cart.items[i].id)
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity
            })
          )
        }

        let mailOptions = {
          from: 's87160204@gmail.com',
          to: 's87160204@gmail.com',
          subject: `${order.id}訂單已成立`,
          html:
            `
          以下是您的訂單:
          <h1>${order.items}</h1>
          `
        }

        mailer.sendMail(mailOptions, (error, info) => {
          if (error) console.log('Error:', error)
          console.log('Email sent:', info.response)
        })


        return Promise.all(results).then(() => {
          res.redirect('/orders')
        })
      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('back')
      })
    })
  },
  getPayment: (req, res) => {
    console.log('===Payment===')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id).then(order => {
      return res.render('payment', { order: order.toJSON() })
    })
  },
  spgatewayCallback: (req, res) => {
    console.log('======spgatewayCallback======')
    console.log(req.body)
    console.log('==============================')

    return res.redirect('back')
  }

}




module.exports = orderController