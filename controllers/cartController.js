const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10
const PAGE_OFFSET = 0


let cartController = {
  getCart: (req, res) => {
    // return Cart.findOne({ include: 'items' })
    console.log('***********')
    console.log(req.session)
    console.log('***********')
    // console.log(req.user.id)
    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart ? cart.toJSON() : { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      console.log(cart)
      return res.render('cart', {
        cart: cart,
        totalPrice: totalPrice
      })
    })
  },

  postCart: async (req, res) => {
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
    })
    await cartItem[0].update({
      quantity: (cartItem[0].quantity || 0) + 1
    })

    console.log(cart)

    req.session.cartId = cart[0].dataValues.id
    req.session.save((err) => res.redirect('back'))
  },

  addCartitem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.update({
          quantity: cartItem.quantity + 1
        })
      }).then((cartItem) => {
        return res.redirect('back')
      })
  },

  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.update({
          quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1
        })
      }).then((cartItem) => {
        return res.redirect('back')
      })
  },

  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id)
      .then(cartItem => {
        cartItem.destroy()
          .then((cartItem) => {
            return res.redirect('back')
          })
      })
  }




}

module.exports = cartController