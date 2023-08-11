const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem

const CartService = {
  cart:null,

  // setCart: async(req)=>{
  // },

  getCart: async(req)=>{
    try{
      let cart = await Cart.findByPk(req.session.cartId,{include:'items'})
      cart = cart ? cart.toJSON(): { items:[]}
      const totalPrice = cart.items.length > 0 ? cart.items.map(d=>d.price*d.CartItem.quantity).reduce((a,b)=>a+b):0
      return {
        cart,
        totalPrice
      }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  postCart: async(req)=>{
    try{
      const cart = await Cart.findOrCreate({
        where: {
          id: req.session.cartId || 0
        }
      })
      //this.cart = cart
      const cartItem = await CartItem.findOrCreate({
        where:{
          CartId:cart[0].dataValues.id,
          ProductId:req.body.productId
        },
        default:{
          CartId:cart[0].dataValues.id,
          ProductId:req.body.productId
        }
      })
      await cartItem[0].update({
        quantity:(cartItem[0].quantity || 0) +1
      })
      // update session
      req.session.cartId = cart[0].dataValues.id
      req.session.save()
      return { 'message':'已加入購物車'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  addCartItem: async(req)=>{
    try{
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.update({quantity:cartItem.quantity+1})
      return {'message':'已加入購物車'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  subCartItem: async(req)=>{
    try{
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.update({
        quantity:cartItem.quantity -1 >= 1? cartItem.quantity-1:1
      })
      return {'message':'已移出購物車'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  deleteCartItem:async(req)=>{
    try{
      const cartItem = await CartItem.findByPk(req.params.id)
      await cartItem.destroy()
      return {'message':'已移出購物車'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = CartService