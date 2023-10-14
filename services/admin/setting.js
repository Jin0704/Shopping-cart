
class SettingService {
  constructor(db){
    this.db = db
  }

  async getSettings(){
    try{
      let data = await this.db.Settings.findByPk(1)
      return data.toJSON();
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  } 
}

module.exports = SettingService