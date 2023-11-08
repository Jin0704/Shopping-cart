const UserService = require("../user")
const ComputeHelper = require('../../helper/compute')
class OrderService {
  constructor(db){
    this.db = db
  }

  async findAll(req){
    try{
      const PAGE_LIMIT = req.query.perPage ? req.query.perPage : 6
      const PAGE_OFFSET = req.query.page ? (req.query.page-1) * PAGE_LIMIT : 0
      const data = await this.db.Order.findAndCountAll({
        raw: true,
        nest: true,
        includes:['items'],
        limit: PAGE_LIMIT,
        offset: PAGE_OFFSET,
      })
      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findOne(id){
    try{
      const order = await this.db.Order.findByPk(id)
      if(!order) throw new Error('order not exists!')
      return order
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async findOneForAdmin(id){
    try{
      const order = await this.db.Order.findByPk(id, { include: ['items','methods'] })
      if(!order) throw new Error('order not exists!')
      return order
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async update(id,input){
    try{
      const order =await this.findOne(id)
      await order.update({
        payment_status: input.payment_status,
        shipping_status: input.shipping_status
      })
      if(input.payment_status=='已付款'){
        const rewardPoint = await ComputeHelper.convertOrderAmountToRewardPoint(order.dataValues.amount)
        await UserService.updateRewardPoint(order.dataValues.UserId,rewardPoint)
      }
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

  async delete(id){
    try{
      const order =await this.findOne(id)
      await order.destroy()
      return true
    }catch(err){
      console.error(err)
      throw new Error(err)
    }   
  }
}

module.exports = OrderService