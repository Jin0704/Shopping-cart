// const redis = require('redis')
require('dotenv').config()
const { Redis } = require('ioredis') // 改用ioredis

const connectionOption = { 
  host:process.env.REDIS_HOST ||'127.0.0.1',
  port:process.env.REDIS_PORT || 6379
}

const expireDay = 60 * 60 * 24;

class Cache {
  static redisClient= null
  static async connectRedis(){
    try{
      this.redisClient = new Redis(connectionOption)
      this.redisClient.on('err',(err)=>{
        console.error(err)
      })
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
    return true;
  }
  static async setKey(key,value){
    console.log('====== data insert into redis ======')
    await this.redisClient.set(key,value, 'EX', expireDay)
    return true;
  }
  static async getKey(key){
    console.log('====== data from redis ======')
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  }
  static async clearKey(key){
    await this.redisClient.del(key);
    return true
  }
}

module.exports = Cache