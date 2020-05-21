'use strict'
// external deps
const debug = require('debug')('app:user')
const uuid = require('uuid').v1
const assert = require('assert')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const createError = require('http-errors')
const {isEmail}  = require('valid.js').util

// internal deps
const db = require('../lib/db.js')
const errorMessages = require('../lib/error-message.js')

// helper methods
const hasRequiredInputData = async (props) => {
  debug('hasRequiredInputData')
  assert(props.username.length > 7, createError(400, 'invalid password'))
  assert(props.password.length > 7, createError(400, 'invalid password'))
  assert(isEmail(props.email), createError(400, 'invalid email'))
  assert(props.firstName, createError(400, 'invlaid firstName'))
  assert(props.lastName, createError(400, 'invalid lastName'))
}

const hashPassword = async (password) => bcrypt.hash(password, 8)

const comparePassword = async (password, user) => {
  debug('comparePassword')
  let success = await bcrypt.compare(password, user.passwordHash)
  if(!success) throw createError(400, errorMessages.authBadPassword())
  return user
}

// interface
class User {
  constructor(props){
    debug('constructor')
    this.id = props.id || 'user:' + props.email 
    this.email = props.email
    this.username = props.username
    this.lastName = props.lastName
    this.firstName = props.firstName
    this.passwordHash = props.passwordHash
    this.validate()
  }

  validate(){
    debug('validate')
    assert(this.id.startsWith('user:'), createError(400, 'invalid id'))
    assert(this.username.length > 7, createError(400, 'invalid password'))
    assert(isEmail(this.email), createError(400, 'invalid email'))
    assert(this.passwordHash, createError(400, 'invalid passwordHash'))
    assert(this.firstName, createError(400, 'invlaid firstName'))
    assert(this.lastName, createError(400, 'invalid lastName'))
  }

  toSafeJSON(){
    debug('toSafeJSON')
    return JSON.stringify(Object.assign({}, this, {passwordHash: undefined}))
  }

  async createAuthToken(){
    let seed = crypto.randomBytes(32).toString('base64')  
    return await jwt.sign({seed, email: this.email, id: this.id})
  }

  async verifyPassword(password){
    let success = await bcrypt.compare(password, this.passwordHash)
    if(!success)
      throw createError(401, '_AUTH_ERROR_ password not valid')
  }

  async verifyToken(token){
    let {id} = result = await promisify(jwt.verify)(token, process.env.APP_SECRET)
    if (this.id != id)
      throw createError(401, '_AUTH_ERROR_ token not valid')
    return this
  }

}

// static methods
User.createUser = async (props) => {
  debug('createUser')
  await hasRequiredInputData(props)
  let passwordHash = await hashPassword(props.password)
  let user = new User({passwordHash, ...props})
  return await db.writeItem(user)
}

User.findUser = async (id) => {
  let data = await db.fetchItem(id)
  return new User(data)
}

module.exports = User
