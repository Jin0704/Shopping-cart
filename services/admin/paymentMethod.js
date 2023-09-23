const db = require('../../models')
const PaymentMethod = db.PaymentMethod

class PaymentMethodService{
  static async getPaymentMethod(id){
    try{
      const data = await PaymentMethod.findByPk(id)
      if(!data) throw new Error('PaymentMethod not exists!')
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async findAll(){
    try{
      const paymentMethods = await PaymentMethod.findAll({raw:true})
      return paymentMethods
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async findOne(id){
    try{
      const paymentMethod = await this.getPaymentMethod(id)
      return paymentMethod.toJSON()
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async create(input){
    try{
      await this.checkPaymentMethod(input.name)
      await PaymentMethod.create(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async update(id,input){
    try{
      const paymentMethod = await this.getPaymentMethod(id)
      input.name = input.name === paymentMethod.name ? input.name : await this.checkPaymentMethod(input.name)
      await paymentMethod.update(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async delete(id){
    try{
      const paymentMethod = await this.getPaymentMethod(id)
      await paymentMethod.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  static async checkPaymentMethod(name){
    try{
      const data = await PaymentMethod.findOne({ where:{name}})
      if(data) throw new Error('PaymentMethod have existed!')
      return name
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }
}


module.exports = PaymentMethodService