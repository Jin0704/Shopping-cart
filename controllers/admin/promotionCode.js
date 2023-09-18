const db = require('../../models')
const PromotionCode = db.PromotionCode
const PromotionCodeService = require('../../services/admin/promotionCode')
const yupCheck = require('../../helper/yupCheck')

class PromotionCodeController {
  static async findAll(req,res){
    try{
      const promotionCodes = await PromotionCodeService.findAll()
      return res.render('admin/promotionCodes',{promotionCodes})
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  static async findOne(req,res){
    try{
      const promotionCode = await PromotionCodeService.findOne(req.params.id)
      return res.render('admin/promotionCode',{promotionCode})
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  static async create(req,res){
    try{
      await yupCheck.promotionCodeShape(req.body)
      await PromotionCodeService.create(req.body)
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/promotionCodes')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  static async update(req,res){
    try{
      await yupCheck.promotionCodeShape(req.body)
      await PromotionCodeService.update(req.params.id,req.body)
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/promotionCodes')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  static async delete(req,res){
    try {
      const promotionCode = await PromotionCode.findByPk(req.params.id)
      await promotionCode.destroy()
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/promotionCodes')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  }

}


module.exports = PromotionCodeController