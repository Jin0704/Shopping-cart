
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

  editSettings = async(req,res)=>{
    try{
      const input = req.body
      const setting = await this.settingService.editSettings(input)
      req.flash('success_messages', '更新成功')
      return res.render('admin/settings', { setting })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }
}

module.exports = SettingController