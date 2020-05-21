'use strict'
// extern deps
const debug = require('debug')('app:basic')
const createError = require('http-errors')

// intern deps
const User = require('../model/user.js')

// helper functions
let validateBasicAuth = async (email, password) => {
  debug('validateBasicAuth')
  let user = await User.findByID('user:' + email)
  return await user.verifyPassword(password)
}

// interface
module.exports = (req, res, next) => {
  debug('basic auth middleware')
  let {authorization} = req.headers
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'))

  let encoded = authorization.split('Basic ')[1]
  if(!encoded)
    return next(createError(400, 'AUTH ERROR: not basic auth'))

  let decoded = Buffer.from(encoded, 'base64').toString()
  let [email, password] = decoded.split(':')
  if(!email || !password)
    return next(createError(401, 'AUTH ERROR: username or password missing'))

  validateBasicAuth(email, password)
  .then((user) => {
    req.user = user
    next()
  })
  .catch(next)
} 
