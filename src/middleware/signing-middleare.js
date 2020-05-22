'use strict'
// internal deps
const hmac = require('../lib/hmac.js')
const createError('http-errors')

// interface
module.exports = (req, res, next) => {
  if(!req.authToken)
    return next(createError(401, '_SIGNING_ERROR_ no token to sign with'))

  res.signJSON = (...args) => {
    let signature = await hmac.hashData(req.authToken)
    res.set('X-Taskomatic-Signature', signature)
    res.josn(...args)
  }
}
