const yup = require('yup')

const yupCheck = {
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
  }
}

module.exports = yupCheck