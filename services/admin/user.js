
class UserService {
  constructor(db){
    this.db = db
  }

  async findAll(){
    try{
      const data = await this.db.User.findAll({raw:true,nest:true,where:{isAdmin:0}})
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findOne(id){
    try{
      let data = await this.db.User.findByPk(id)
      data = data ? data.toJSON() : null
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = UserService