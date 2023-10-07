const yupCheck = require('../../helper/yupCheck')
const responseBuilder = require('../../helper/responseBuilder')

class PromotionCodeApiController {
  constructor(promotionCodeService){
    this.promotionCodeService = promotionCodeService
  }

  findAll = async(req,res)=>{
    let data;
    try{
      data = await this.promotionCodeService.findAll()
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  }

  findOne = async(req,res)=>{
    let data;
    try{
      data = await this.promotionCodeService.findOne(req.params.id)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  }

  create = async(req,res)=>{
    try{
      await yupCheck.promotionCodeShape(req.body)
      await this.promotionCodeService.create(req.body)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,{"msg":"success"})
  }

  update = async(req,res)=>{
    try{
      await yupCheck.promotionCodeShape(req.body)
      await this.promotionCodeService.update(req.params.id,req.body)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,{"msg":"success"})
  }
  
  delete = async(req,res)=>{
    try {
      await this.promotionCodeService.delete(req.params.id)
    } catch (err) {
      console.log(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,{"msg":"success"})
  }

}

module.exports = PromotionCodeApiController