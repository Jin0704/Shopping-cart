const yupCheck = require('../../helper/yupCheck')
const PaymentMethodService = require('../../services/admin/paymentMethod')
const redis = require('../../redis')

class PaymentMethodController {
  constructor(paymentMethodService){
    this.paymentMethodService = paymentMethodService
  }

  findAll = async(req,res)=>{
    try{
      const paymentMethods = await this.paymentMethodService.findAll()
      return res.render('admin/paymentMethods',{paymentMethods})
    }catch(err){
      console.error(err)
      return res.status(404).render('error',{err})
    }
  }

  findOne = async(req,res)=>{
    try{
      const paymentMethod = await this.paymentMethodService.findOne(req.params.id)
      return res.render('admin/paymentMethod',{paymentMethod})
    }catch(err){
      console.error(err)
      return res.status(404).render('error',{err})
    }
  }

  create = async(req,res)=>{
    try{
      return res.render('admin/paymentMethod')
    }catch(err){
      console.error(err)
      return res.status(404).render('error',{err})
    }
  }

  store = async(req,res)=>{
    try{
      await this.paymentMethodService.create(req.body)
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/paymentMethods')
    }catch(err){
      console.error(err)
      return res.status(404).render('error',{err})
    }
  }

  update = async(req,res)=>{
    try{
      await this.paymentMethodService.update(req.params.id, req.body)
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/paymentMethods')
    }catch(err){
      console.error(err)
      return res.status(404).render('error',{err})
    }
  }

  delete = async(req,res)=>{
    try{
      await this.paymentMethodService.delete(req.params.id)
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/paymentMethods')      
    }catch(err){
      console.error(err)
      return res.status(404).render('error',{err})
    }
  }
}

// const PaymentMethodController = {
//   getPaymentMethods: async(req,res)=>{
//     try{
//       const redisResponse = await redis.getKey('admin-paymentMethods')
//       if(redisResponse) return res.render('admin/paymentMethods', { paymentMethods:redisResponse})

//       const paymentMethods = await PaymentMethodService.findAll()
//       await redis.setKey('admin-paymentMethods',JSON.stringify(paymentMethods))
//       return res.render('admin/paymentMethods', { paymentMethods })
//     }catch(err){
//       console.error(err)
//       return res.render('error',{err})
//     }
//   },
//   getPaymentMethod: async(req,res)=>{
//     try {
//       const paymentMethod = await PaymentMethodService.findOne(req.params.id)
//       return res.render('admin/paymentMethod', { paymentMethod })
//     } catch (error) {
//       console.log(error)
//       return res.render('error',{error})
//     }
//   },

//   createPaymentMethod: async(req,res)=>{
//     return res.render('admin/paymentMethod')
//   },

//   postPaymentMethod: async(req,res)=>{
//     try {
//       await yupCheck.paymentMethodShape(req.body)
//       await PaymentMethodService.create(req.body)
//       await redis.clearKey('admin-paymentMethods')
//       req.flash('success_messages', '新增成功')
//       return res.redirect('/admin/paymentMethods')
//     } catch (err) {
//       console.log(err)
//       return res.render('error',{err})
//     }
//   },

//   editPaymentMethod: async (req, res) => {
//     try {
//       await yupCheck.paymentMethodShape(req.body)
//       await PaymentMethodService.update(req.params.id,req.body)
//       await redis.clearKey('admin-paymentMethods')
//       req.flash('success_messages', '更新成功')
//       return res.redirect('/admin/paymentMethods')
//     } catch (err) {
//       console.log(err)
//       return res.render('error',{err})
//     }
//   },

//   deletePaymentMethod: async (req, res) => {
//     try {
//       await PaymentMethodService.delete(req.params.id)
//       await redis.clearKey('admin-paymentMethods')
//       req.flash('success_messages', '刪除成功')
//       return res.redirect('/admin/paymentMethods')
//     } catch (err) {
//       console.log(err)
//       return res.render('error',{err})
//     }
//   },    
// }

module.exports = PaymentMethodController