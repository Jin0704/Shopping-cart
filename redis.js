const redis = require('redis')
require('dotenv').config()
const connectionOption = { host: process.env.REDIS_HOST, port:process.env.REDIS_PORT}
const expireDay = 60 * 60 * 24;

const Redis = {
  redisClient:null,
  connectRedis: async()=>{
    try{
      this.redisClient = await redis.createClient(connectionOption)
      this.redisClient.on('err',(err)=>{
        console.error(err)
      })
      await this.redisClient.connect()
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
    return true;
  },
  setKey: async (key,value)=>{
    console.log('====== data insert into redis ======')
    await this.redisClient.set(key,value, 'EX', expireDay)
    return true;
  },
  getKey: async (key)=>{
    console.log('====== data from redis ======')
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  },
  clearKey: async(key)=>{
    await this.redisClient.del(key);
    return true
  }
}

module.exports = Redis