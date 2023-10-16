
class UserController {
  constructor(userService){
    this.userService = userService
  }

  findAll = async(req,res)=>{
    try{
      const users = await this.userService.findAll()
      return res.render('admin/users',{ users })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

  findOne = async(req,res)=>{
    try{
      const user = await this.userService.findOne(req.params.id)
      return res.render('admin/user', { user })
    }catch(err){
      console.error(err)
      return res.render('error',{err})
    }
  }

}

module.exports = UserController