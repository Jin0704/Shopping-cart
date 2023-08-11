
responseBuilder = {
  success: (res, status, payload) => {
    return res.status(status).json({
      payload
    })
  },

  error: (req, res, status, err) => {
    res.status(status)

    let returnObj = {
      error: true,
      code: status || 500,
      message: err.message,
      data: err?.data,
      meta: {
        url: req.originalUrl,
        address: req.ip,
        method: req.method
      }
    }

    return res.json(returnObj)
  }
}


module.exports = responseBuilder