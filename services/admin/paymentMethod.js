const yupCheck = require('../../helper/yupCheck')

class PaymentMethodService{
  constructor(db){
    this.db = db
  }

  async getPaymentMethod(id){
    try{
      const data = await this.db.PaymentMethod.findByPk(id)
      if(!data) throw new Error('PaymentMethod not exists!')
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findAll(){
    try{
      const paymentMethods = await this.db.PaymentMethod.findAll({raw:true})
      return paymentMethods
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findOne(id){
    try{
      const paymentMethod = await this.getPaymentMethod(id)
      return paymentMethod.toJSON()
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async create(input){
    try{
      await this.checkPaymentMethod(input.name)
      await yupCheck.paymentMethodShape(input)
      await this.db.PaymentMethod.create(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async update(id,input){
    try{
      const paymentMethod = await this.getPaymentMethod(id)
      await yupCheck.paymentMethodShape(input)
      input.name = input.name === paymentMethod.name ? input.name : await this.checkPaymentMethod(input.name)
      await paymentMethod.update(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async delete(id){
    try{
      const paymentMethod = await this.getPaymentMethod(id)
      await paymentMethod.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async checkPaymentMethod(name){
    try{
      const data = await this.db.PaymentMethod.findOne({ where:{name}})
      if(data) throw new Error('PaymentMethod have existed!')
      return name
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = PaymentMethodService