const OrderService = require('../../services/order')
const responseBuilder = require('../../helper/responseBuilder')


const OrderController = {
  getOrders : async(req,res)=>{
    let data;
    try{
      data = await OrderService.getOrders(req);
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },

  getOrder : async(req,res)=>{
    let data;
    try{
      data = await OrderService.getOrder(req);
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },


  postOrder : async(req,res)=>{
    let data;
    try{
      data = await OrderService.postOrder(req);
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },

  cancelOrder: async(req,res)=>{
    let data;
    try{
      data = await OrderService.cancelOrder(req);
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  }


}

module.exports = OrderController