const responseBuilder = require('../../../helper/responseBuilder')
const SettingService = require('../../../services/admin/setting')

const SettingController = {
  getSettings: async(req,res)=>{
    try{
      let data = await redis.getKey('api-settings') ? await redis.getKey('api-settings') : await SettingService.getSettings(req)
      return responseBuilder.success(res, 200, data)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
  }
} 

module.exports = SettingController