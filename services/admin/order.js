const db = require('../../models')
const Order = db.Order

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
  putOrder: async(req)=>{
    try{
      const order  = await Order.findByPk(req.params.id)
      if(!order){
        throw new Error('order not exists!')
      }
      await order.update({
        payment_status: req.body.payment_status,
        shipping_status: req.body.shipping_status
      })
      return { 'message':'更新成功'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  deleteOrder: async(req)=>{
    try{
      const order  = await Order.findByPk(req.params.id)
      if(!order){
        throw new Error('order not exists!')
      }
      await order.destroy()
      return { 'message':'刪除成功'}
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}

module.exports = OrderService