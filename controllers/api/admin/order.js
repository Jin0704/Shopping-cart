const responseBuilder = require('../../../helper/responseBuilder')
const OrderService = require('../../../services/admin/order')

const OrderController = {
  getOrders: async(req,res)=>{
    let data;
    try{
      data = await OrderService.getOrders(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  getOrder : async(req,res)=>{
    let data;
    try{
      data = await OrderService.getOrder(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  putOrder: async(req,res)=>{
    let data;
    try{
      data = await OrderService.putOrder(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },
  // 要做成軟刪除
  deleteOrder:async(req,res)=>{
    let data;
    try{
      data = await OrderService.deleteOrder(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  }
}

module.exports = OrderController