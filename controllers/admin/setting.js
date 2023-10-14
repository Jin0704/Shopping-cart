
class SettingController {
  constructor(settingService){
    this.settingService = settingService
  }

  getSettings = async(req,res)=>{
    try{
      const setting = await this.settingService.getSettings()
      return res.render('admin/settings', { setting })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }
}

module.exports = SettingController