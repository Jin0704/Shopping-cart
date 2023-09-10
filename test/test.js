const assert = require('assert')
const request = require('supertest')
const sinon = require('sinon')
const passport = require('../config/passport')
const loginUser = require('../controllers/userController')
const app = require('../app')
const { expect } = require('chai')
//範例
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal([1,2,3].indexOf(4), -1)
    })
  })
})

//test login
describe('POST Login',function(){
  it('response jwt token',function(done){
    request(app)
      .post('/sigin')
      .send({email:"root@example.com",password:12345678})
      .expect(302)
      .end(function(err,res){
        if(err) done(err)
        
      })
      done()
  })
})

//passport
// describe('Login',()=>{
//   it('should call passport auth',function(){
//     const authenticatedSub = sinon.stub(passport,'authenticate').callsFake((strategy,options,callback)=>{
//       return (req,res,next)=>{
//         console.log('=====res',res)
//       }
//     })

//   })
// })

// supertest
describe('GET /api/products',function(){
  it('response with json', function(done){
    request(app)
      .get('/api/products')
      .set('Accept','application/json')
      .expect(200)
      .end(function(err,res){
        if(err) return done(err)
        done()
      })
  })
})

describe('GET /api/admin/products',function(){
  it('admin response with json', function(done){
    request(app)
      .get('/api/admin/products')
      .set('Accept','application/json')
      .expect(401)
      .end(function(err,res){
        if(err) return done(err)
        done()
      })
  })
})