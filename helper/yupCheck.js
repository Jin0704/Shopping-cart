const yup = require('yup')

const yupCheck = {
  signInShape: async(input)=>{
    const bodyShape = yup.object().shape({
      email: yup.string().matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, 'Invalid email format').required(),
      password: yup.string().matches(/^[a-zA-Z0-9+_.-]/).required()
    })
    try{
      await bodyShape.validate(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  signUpShape: async(input)=>{
    const bodyShape = yup.object().shape({
      email: yup.string().matches(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, 'Invalid email format').required(),
      password: yup.string().matches(/^[a-zA-Z0-9+_.-]/).required(),
      confirmpassword: yup.string().matches(/^[a-zA-Z0-9+_.-]/).required(),
    })
    try{
      await bodyShape.validate(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  productShape: async(input)=>{
    const bodyShape = yup.object().shape({
      name: yup.string().required(),
      price : yup.number().required(),
      description: yup.string().nullable().default(''),
      CategoryId: yup.string().required(),
      image: yup.string().nullable().default('')
    })
    try{
      await bodyShape.validate(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  categoryShape: async(input)=>{
    const bodyShape = yup.object().shape({
      name: yup.string().required(),
      status: yup.number().oneOf([0,1]).default(0)
    })
    try{
      await bodyShape.validate(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
  orderShape: async(input)=>{
    const bodyShape = yup.object().shape({
      name: yup.string().required(),
      address: yup.string().required(),
      phone: yup.string().required(),
      shipping_status: yup.string().required(),
      payment_status: yup.string().required(),
      amount: yup.number().required(),
      UserId: yup.number().required(),
      PaymentMethodId: yup.number().required(),
    })    
    try{
      await bodyShape.validate(input)
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  },
}

module.exports = yupCheck