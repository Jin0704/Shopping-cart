


const initSocket = (server)=>{
  const io = require('socket.io')(server)
  io.on('connection', async socket=>{
    try{
      console.log('connected!')
    }catch(err){
      console.error(err)
      socket.disconnect(true)
    }
  })
  return io
}

module.exports = initSocket