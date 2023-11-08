const CommonService = require('../../services/common')

class OrderController {
  constructor(OrderService){
    this.OrderService = OrderService
  }

  findAll = async(req,res)=>{
    try{
      const orders = await this.OrderService.findAll(req)
      const pagination = await CommonService.calculatePagination({}, orders.count, req.query.page)
      return res.render('admin/orders',{
        orders:orders.rows, ...pagination
      })
    }catch(err){
      console.error(err)
      return res.status(400).render('error',{err})
    }
  }

  findOne = async(req,res)=>{
    try{
      const order = await this.OrderService.findOneForAdmin(req.params.id)
      return res.render('admin/order',{order:order.toJSON()})
    }catch(err){
      console.error(err)
      return res.status(400).render('error',{err})
    }
  }

  update = async(req,res)=>{
    try{
      await this.OrderService.update(req.params.id,req.body)
      req.flash('success_messages', '更新成功')
      res.redirect('/admin/orders')
    }catch(err){
      console.error(err)
      return res.status(400).render('error',{err})
    }
  }

  delete = async(req,res)=>{
    try{
      await this.OrderService.delete(req.params.id)
      req.flash('success_messages', '成功刪除')
      res.redirect('/admin/orders')
    }catch(err){
      console.error(err)
      return res.status(400).render('error',{err})
    }    
  }
}

module.exports = OrderController