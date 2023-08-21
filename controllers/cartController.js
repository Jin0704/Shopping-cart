const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PaymentMethod = db.PaymentMethod

let cartController = {
  getCart: async (req, res) => {
    try {
      // return Cart.findOne({ include: 'items' })
      console.log('***********')
      console.log(req.session)
      console.log('***********')
      // console.log(req.user.id)
      let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
      const paymentMethods = await PaymentMethod.findAll({
        raw:true,
        where:{status:1}
      })
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart: cart,
        paymentMethods,
        totalPrice: totalPrice
      })
    } catch (err) {
      console.log(err)
    }
  },

  postCart: async (req, res) => {
    try {
      const cart = await Cart.findOrCreate({
        where: {
          id: req.session.cartId || 0
        }
      })

      const cartItem = await CartItem.findOrCreate({
        where: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart[0].dataValues.id,
          ProductId: req.body.productId
        }
      })
      await cartItem[0].update({
        quantity: (cartItem[0].quantity || 0) + 1
      })
      // console.log(cart)
      req.flash('success_messages', '已加入購物車!')
      req.session.cartId = cart[0].dataValues.id
      req.session.save((err) => res.redirect('back'))
    } catch (err) {
      console.log(err)
    }
  },

  addCartitem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.update({ quantity: cartItem.quantity + 1 })
      req.flash('success_messages', '已加入購物車!')
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },

  subCartItem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.update({ quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1 })
      req.flash('success_messages', '已移出購物車!')
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  },

  deleteCartItem: async (req, res) => {
    try {
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.destroy()
      req.flash('success_messages', '已移出購物車!')
      return res.redirect('back')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = cartController