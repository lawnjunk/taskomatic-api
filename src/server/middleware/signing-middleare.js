'use strict'
// external deps
const debug = require('debug')('app:signing')
const hmac = require('../lib/hmac.js')
const createError = require('http-errors')

// interface
module.exports = (req, res, next) => {
  if(!req.authToken)
    return next(createError(401, '_SIGNING_ERROR_ no token to sign with'))

  res.signJSON = async (data) => {
    debug('signJSON')
    let signature = await hmac.hashData(data, req.authToken)
    res.set('X-Taskomatic-Signature', signature)
    res.json(data)
  }
  next()
}
