const CartService = require('../../services/cart')
const responseBuilder = require('../../helper/responseBuilder')


const cartController = {

  getCart : async(req,res)=>{
    let data;
    try{
      data = await CartService.getCart(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },

  postCart : async(req,res)=>{
    let data;
    try{
      data = await CartService.postCart(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },

  addCartItem: async(req,res)=>{
    let data;
    try{
      data = await CartService.addCartItem(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },

  subCartItem: async(req,res)=>{
    let data;
    try{
      data = await CartService.subCartItem(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  },

  deleteCartItem: async(req,res)=>{
    let data;
    try{
      data = await CartService.deleteCartItem(req)
    }catch(err){
      console.error(err)
      return responseBuilder.error(req,res,400,err)
    }
    return responseBuilder.success(res,200,data)
  }

}



module.exports = cartController;