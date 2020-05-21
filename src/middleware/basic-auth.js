'use strict'
// extern deps
const createError = require('http-errors')

// intern deps
const User = require('../model/user.js')

let validateBasicAuth = async (email, password) => {
  let user = await findByID('user:' + email)
  return await user.verifyPassword(password)
}

// interface
module.exports = (req, res, next) => {
  let {authorization} = req.headers
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'))

  let encoded = authorization.split('Basic ')[1]
  if(!encoded)
    return next(createError(400, 'AUTH ERROR: not basic auth'))

  let decoded = new Buffer(encoded, 'base64').toString()
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
