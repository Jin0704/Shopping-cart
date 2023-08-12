const AWS = require('aws-sdk')
const fs = require('fs')
require('dotenv').config()

async function uploadFileToS3(req){
  let s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

  const bucketName = process.env.BUCKET
  const fileName = req.file.originalname
  const fileData = fs.readFileSync(req.file.path);
  try{
    // 上傳圖片
    const result = await s3.upload({
      Bucket: bucketName,
      Key: fileName,
      Body: fileData
    }).promise()
    const imageUrl = result.Location;
    return imageUrl
  }catch(err){
    console.error(err)
    throw new Error(err)
  }

}


module.exports = uploadFileToS3