require('dotenv').config()
const crypto = require('crypto')

const newebpay = {
  MerchantID : process.env.NEWEBPAY_MERCHANTID,
  HashKey : process.env.NEWEBPAY_HASHKEY,
  HashIV : process.env.NEWEBPAY_HASHIV,
  PayGateWay : process.env.NEWEBPAY_PAYGATEWAY,
  ReturnURL : process.env.NEWEBPAY_RETURNURL,
  NotifyURL : process.env.NEWEBPAY_NOTIFYURL,
  ClientBackURL : process.env.NEWEBPAY_CLIENTBACKURL,


  //取得交易字串物件並轉換成字串
  genDataChain: (TradeInfo)=> {
    let results = []
    for (let kv of Object.entries(TradeInfo)) {
      results.push(`${kv[0]}=${kv[1]}`)
    }
    return results.join('&')
  },

  //將字串進行加密(用AES加密法)
  create_mpg_aes_encrypt(TradeInfo) {
    let encrypt = crypto.createCipheriv('aes256', this.HashKey, this.HashIV)
    let enc = encrypt.update(this.genDataChain(TradeInfo), 'utf8', 'hex')
    return enc + encrypt.final('hex')
  },

  //將字串雜湊
  create_mpg_sha_encrypt(TradeInfo) {

    let sha = crypto.createHash('sha256')
    let plainText = `HashKey=${this.HashKey}&${TradeInfo}&HashIV=${this.HashIV}`

    return sha.update(plainText).digest('hex').toUpperCase()
  },


  create_mpg_aes_decrypt(TradeInfo) {
    const decrypt = crypto.createDecipheriv('aes256', this.HashKey, this.HashIV)
    decrypt.setAutoPadding(false)
    const text = decrypt.update(TradeInfo, 'hex', 'utf8')
    const plainText = text + decrypt.final('utf8')
    const result = plainText.replace(/[\x00-\x20]+/g, '')
    return result
  },

  getTradeInfo(Amt, Desc, email) {

    // console.log('===== getTradeInfo =====')
    // console.log(Amt, Desc, email)
    // console.log('==========')

    data = {
      'MerchantID': this.MerchantID, // 商店代號
      'RespondType': 'JSON', // 回傳格式
      'TimeStamp': Date.now(), // 時間戳記
      'Version': 1.5, // 串接程式版本
      'MerchantOrderNo': Date.now(), // 商店訂單編號
      'LoginType': 0, // 智付通會員
      'OrderComment': 'OrderComment', // 商店備註
      'Amt': Amt, // 訂單金額
      'ItemDesc': Desc, // 產品名稱
      'Email': email, // 付款人電子信箱
      'ReturnURL': this.ReturnURL, // 支付完成返回商店網址
      'NotifyURL': this.NotifyURL, // 支付通知網址/每期授權結果通知
      'ClientBackURL': this.ClientBackURL, // 支付取消返回商店網址
    }

    // console.log('===== getTradeInfo: data =====')
    // console.log(data)


    const mpg_aes_encrypt = this.create_mpg_aes_encrypt(data)
    const mpg_sha_encrypt = this.create_mpg_sha_encrypt(mpg_aes_encrypt)

    // console.log('===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====')
    // console.log(mpg_aes_encrypt)
    // console.log(mpg_sha_encrypt)

    tradeInfo = {
      'MerchantID': this.MerchantID, // 商店代號
      'TradeInfo': mpg_aes_encrypt, // 加密後參數
      'TradeSha': mpg_sha_encrypt,
      'Version': 1.5, // 串接程式版本
      'PayGateWay': this.PayGateWay,
      'MerchantOrderNo': data.MerchantOrderNo,
    }

    // console.log('===== getTradeInfo: tradeInfo =====')
    // console.log(tradeInfo)

    return tradeInfo
  }
}

module.exports = newebpay