const db = require('../../models')
const Order = db.Order
const UserService = require("../user")
const ComputeHelper = require('../../helper/compute')

const OrderService = {
  getOrders: async(req)=>{
    try{
      const PAGE_LIMIT = req.query.perPage ? req.query.perPage : 6
      const PAGE_OFFSET = req.query.page ? (req.query.page-1) * PAGE_LIMIT : 0
      const orders = await Order.findAndCountAll({
        raw:true,
        nest:true,
        includes:['items'],
        limit:PAGE_LIMIT,
        offset: PAGE_OFFSET
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(orders.count / PAGE_LIMIT)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return {
        orders: orders.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      }

    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  getOrder: async(req)=>{
    try{
      const order  = await Order.findByPk(req.params.id)
      if(!order){
        throw new Error('order not exists!')
      }
      return { order }
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  // for admin 
  getAdminOrder: async(id)=>{
    try{
      const order  = await Order.findByPk(id, { include: ['items','methods'] })
      if(!order){
        throw new Error('order not exists!')
      }
      return order.toJSON()
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },

  putOrder: async(id,input)=>{
    try{
      const order  = await Order.findByPk(id)
      if(!order){
        throw new Error('order not exists!')
      }
      await order.update({
        payment_status: input.payment_status,
        shipping_status: input.shipping_status
      })
      if(input.payment_status=='已付款'){
        const rewardPoint = await ComputeHelper.convertOrderAmountToRewardPoint(order.dataValues.amount)
        await UserService.updateRewardPoint(order.dataValues.UserId,rewardPoint)
      }
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  deleteOrder: async(id)=>{
    try{
      const order  = await Order.findByPk(id)
      if(!order){
        throw new Error('order not exists!')
      }
      await order.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}

module.exports = OrderService