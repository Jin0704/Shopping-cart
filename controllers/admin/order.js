const db = require('../../models')
const Order = db.Order

const OrderController = {
  getOrders: async (req, res) => {
    try {
      let PAGE_OFFSET = 0
      const OrderPagelimit = 10
      if (req.query.page) {
        PAGE_OFFSET = (req.query.page - 1) * OrderPagelimit
      }
      //要改用sql語法去撈關聯資料，用include會有問題
      const orders = await Order.findAndCountAll({
        raw: true,
        nest: true,
        // includes: ['items'],
        limit: OrderPagelimit,
        offset: PAGE_OFFSET,
      })

      const page = Number(req.query.page) || 1
      const pages = Math.ceil(orders.count / OrderPagelimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      return res.render('admin/orders', {
        orders: orders.rows,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }

  },

  getOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, { include: ['items','methods'] })
      return res.render('admin/order', { order: order.toJSON(), })
    } catch (error) {
      console.log(error)
      return res.render('error',{err})
    }

  },

  putOrder: async (req, res) => {
    try {
      let order = await Order.findByPk(req.params.id)
      await order.update({
        payment_status: req.body.payment_status,
        shipping_status: req.body.shipping_status
      })

      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/orders')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id)
      await order.destroy()
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/orders')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },  
}

module.exports = OrderController