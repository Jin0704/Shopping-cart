const db = require('../../models')
const PaymentMethod = db.PaymentMethod
const responseBuilder = require('../../helper/responseBuilder')

const PaymentMethodController = {
  getPaymentMethods: async(req,res)=>{
    let data;
    try {
      data = await PaymentMethod.findAll({status:1})
    } catch (err) {
      console.error(err)
      return responseBuilder.error(req, res, 400, err)
    }
    return responseBuilder.success(res, 200, data)    
  }
} 

module.exports = PaymentMethodController