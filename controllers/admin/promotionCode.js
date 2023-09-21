const yupCheck = require('../../helper/yupCheck')

class PromotionCodeController {
  constructor(promotionCodeService) {
      this.promotionCodeService = promotionCodeService
  }

  findAll = async(req,res)=>{
    try{
      const promotionCodes = await this.promotionCodeService.findAll()
      return res.render('admin/promotionCodes',{promotionCodes})
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  findOne = async(req,res)=>{
    try{
      const promotionCode = await this.promotionCodeService.findOne(req.params.id)
      return res.render('admin/promotionCode',{promotionCode})
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  create = async(req,res)=>{
    try{
      await yupCheck.promotionCodeShape(req.body)
      await this.promotionCodeService.create(req.body)
      req.flash('success_messages', '新增成功')
      return res.redirect('/admin/promotionCodes')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  update = async(req,res)=>{
    try{
      await yupCheck.promotionCodeShape(req.body)
      await this.promotionCodeService.update(req.params.id,req.body)
      req.flash('success_messages', '更新成功')
      return res.redirect('/admin/promotionCodes')
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  delete = async (req,res)=>{
    try {
      await this.promotionCodeService.delete(req.params.id)
      req.flash('success_messages', '刪除成功')
      return res.redirect('/admin/promotionCodes')
    } catch (err) {
      console.log(err)
      return res.render('error',{err})
    }
  }

}


module.exports = PromotionCodeController