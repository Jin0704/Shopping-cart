const db = require('../models')
const {Order,OrderItem,Cart,CartItem,User,Product} = db
const crypto = require('crypto')
const _ = require('lodash')
require('dotenv').config()

const OrderService = {
  getOrders: async(req)=>{
    try{
      const user = await User.findByPk(req.user.id)
      const orders = await Order.findAll({
        where:{
          UserId: user.id
        },
        include:[{
          model:Product,as:'items'
        }]
      })
      const ordersJSON = orders.map(order=>order.toJSON())
      return {orders:ordersJSON}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  getOrder: async(req)=>{
    try{
      const order = await Order.findByPk(req.params.id)
      return {order:order.toJSON()}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  postOrder: async(req)=>{
    try{
      // checking order is Valid
      const input = req.body
      await checkOrderValid(input);
      const results = []
      const cart = await Cart.findByPk(req.body.cartId,{include:'items'})
      if(!cart){
        return {'message':'購物車中沒有產品!'}
      }
      const order = await Order.create({
        ...req.body,
        amount: Number(req.body.amount),
        UserId: req.user.id
      })
      
      for(let i=0;i<cart.items.length;i++){
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

      const cartItem = await CartItem.findOne({
        where: { CartId:cart.id}
      })
      await Promise.all(results)
      //清空session中的cartId
      req.session.cartId = ''
      return {'message':'訂單建立成功'}

    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  cancelOrder: async(req)=>{
    try{
      const order = await Order.findByPk(req.params.id,{})
      await order.update({
        ...req.body,
        shipping_status:'cancel',
        payment_status:'cancel'
      })
      return {'message':'訂單已取消'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
}

async function checkOrderValid(input){
  if(!_.has(input,'name')){
    throw new Error('name is required!')
  }
  if(!_.has(input,'phone')){
    throw new Error('name is required!')
  }
  if(!_.has(input,'address')){
    throw new Error('name is required!')
  }
  if(!_.has(input,'payment_method')){
    throw new Error('payment_method is required!')
  }
  return true
}


module.exports = OrderService