// external deps
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const {promisify} = require('util')

// internal deps
const User = require('../model/user.js')

module.exports = (req, res, next) => {
  let {authorization} = req.headers
  if(!authorization)
    return next(createError(400, 'AUTH ERROR: no authorization header'))

  let token = authorization.split('Bearer ')[1]
  if(!token)
    return next(createError(400, 'AUTH ERROR: not bearer auth'))

  //promisify(jwt.verify)(token, process.env.SECRET)
  //.then(({email}) => User.findOne({authHash}))
  //.then((user) => {
    //if(!user)
      //throw createError(401, 'AUTH ERROR: user not found')
    //req.user = user
    //next()
  //})
  //.catch(err => createError(401, err))
}
