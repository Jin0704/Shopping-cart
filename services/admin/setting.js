
class SettingService {
  constructor(db){
    this.db = db
  }

  async getSetting(){
    return await this.db.Settings.findByPk(1)
  }

  async getSettings(){
    try{
      const data = await this.getSetting()
      return data.toJSON();
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
  
  async editSettings(input){
    try{
      const data = await this.getSetting()
      await data.update(input)
      return data.toJSON()
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

}

module.exports = SettingService