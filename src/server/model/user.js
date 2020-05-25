'use strict'

// external deps
const uuid = require('uuid').v1
const debug = require('debug')('app:user')
const assert = require('assert')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

// internal modules 
const db = require('../lib/db.js')
const errorMessages = require('../lib/error-message.js')
const {isEmail, isDefined, toBool, isBool}  = require('../lib/util.js')


// helper methods
const jwtSign = promisify(jwt.sign.bind(jwt))
const jwtVerify = promisify(jwt.verify.bind(jwt))

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
    this.uuid = props.uuid || uuid()
    this.id = props.id || 'user:' + props.email  // TODO: rename id to key 
    this.email = props.email
    this.username = props.username
    this.lastName = props.lastName
    this.firstName = props.firstName
    this.passwordHash = props.passwordHash
    this.verified = isDefined(props.verified) ? toBool(props.verified): false
    this.validate()
  }

  validate(){
    debug('validate')
    // TODO: make more strict validation
    assert(this.uuid, createError(400, 'invalid uuid'))
    assert(this.id.startsWith('user:'), createError(400, 'invalid id'))
    assert(this.username.length > 7, createError(400, 'invalid password'))
    assert(isEmail(this.email), createError(400, 'invalid email'))
    assert(this.passwordHash, createError(400, 'invalid passwordHash'))
    assert(this.firstName, createError(400, 'invlaid firstName'))
    assert(this.lastName, createError(400, 'invalid lastName'))
    assert(this.lastName, createError(400, 'invalid lastName'))
    assert(isBool(this.verified), createError(400, 'bad verified'))
  }

  toSafeJSON(){
    debug('toSafeJSON')
    return JSON.stringify(Object.assign({}, this, {passwordHash: undefined}))
  }

  async verifyEmail(){
    debug('verifyEmail')
    this.verified = true
    this.validate()
    return await db.writeItem(this)
  }

  async updatePassword(password){
    debug('updatePassword')
    if(!password)
      throw createError(400, 'password required')
    this.passwordHash = await hashPassword(password)
    this.validate()
    return await db.writeItem(this)
  }

  async updateProfile(props){
    debug('updateProfile')
    this.firstName = props.firstName || this.firstName
    this.lastName = props.lastName || this.lastName
    this.username = props.username || this.username
    this.validate()
    return await db.writeItem(this)
  }

  async createAuthToken(){
    debug('createAuthToken')
    let seed = crypto.randomBytes(32).toString('base64')  
    return await jwtSign({seed, id: this.id}, process.env.APP_SECRET) 
  }

  async verifyAuthToken(token){
    debug('verifyAuthToken')
    let {id} = await jwtVerify(token, process.env.APP_SECRET).catch(err => {
      throw createError(401, '_AUTH_ERROR_ token not valid')
    })
    if (this.id != id)
      throw createError(401, '_AUTH_ERROR_ token not valid')
    return this
  }

  async verifyPassword(password){
    debug('verifyPassword')
    let success = await bcrypt.compare(password, this.passwordHash)
    if(!success)
      throw createError(401, '_AUTH_ERROR_ password not valid')
    return this
  }
  
  async delete(){
    debug('delete', this.id)
    await db.deleteItem({id: this.id})
  }
}

// static methods
User.createUser = async (props) => {
  debug('createUser', props.email)
  await hasRequiredInputData(props)
  let passwordHash = await hashPassword(props.password)
  let user = new User({passwordHash, ...props})
  return await db.writeItem(user)
}

User.fetchByID = async (id) => {
  debug('fetchByID')
  let data = await db.fetchItem({id})
  if(!data)
    throw createError(404, 'no such user')
  return new User(data)
}

User.fetchByEmail = (email) => User.fetchByID('user:' + email)

User.findByToken = async (token) => {
  let {id} = await jwtVerify(token, process.env.APP_SECRET)
  let user = User.fetchByID(id)
  if(!user)
    throw createError(401, '_AUTH_ERROR: user not found')
  return user
}

module.exports = User
