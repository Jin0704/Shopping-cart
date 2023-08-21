const db = require('../../models')
const PaymentMethod = db.PaymentMethod
const yupCheck = require('../../helper/yupCheck')
const redis = require('../../redis')

const PaymentMethodController = {
  getPaymentMethods: async(req,res)=>{
    try{
      let data;
      data = await redis.getKey('admin-paymentMethods')
      if(data){
        return res.render('admin/paymentMethods', {
          paymentMethods:data
        })
      }
      data = await PaymentMethod.findAll({ raw: true})
      await redis.setKey('admin-paymentMethods',JSON.stringify(data))
      return res.render('admin/paymentMethods', { paymentMethods: data })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  },
  getPaymentMethod: async(req,res)=>{
    try {
      const paymentMethod = await PaymentMethod.findByPk(req.params.id)
      return res.render('admin/paymentMethod', { paymentMethod: paymentMethod.toJSON() })
    } catch (error) {
      console.log(error)
      return res.render('error',{err})
    }
  },
  createPaymentMethod: async (req, res) => {
    return res.render('admin/createPaymentMethod')
  },
  postPaymentMethod: async(req,res)=>{
    try {
      await yupCheck.paymentMethodShape(req.body)
      await PaymentMethod.create({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-paymentMethods')
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/paymentMethods')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  editPaymentMethod: async (req, res) => {
    try {
      await yupCheck.paymentMethodShape(req.body)
      const paymentMethod = await PaymentMethod.findByPk(req.params.id)
      await paymentMethod.update({
        name: req.body.name,
        status: req.body.status
      })
      await redis.clearKey('admin-paymentMethods')
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/paymentMethods')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },

  deletePaymentMethod: async (req, res) => {
    try {
      const paymentMethod = await PaymentMethod.findByPk(req.params.id)
      await paymentMethod.destroy()
      await redis.clearKey('admin-paymentMethods')
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/paymentMethods')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  },    
}

module.exports = PaymentMethodController