'use strict'
// external deps
const debug = require('debug')('app:user')
const uuid = require('uuid').v1
const assert = require('assert')
const bcrypt = require('bcrypt')
const {isEmail}  = require('valid.js').util

// internal deps
const db = require('../lib/db.js')
const errorMessages = require('../lib/error-message.js')

// helper methods
const hasRequiredInputData = async (props) => {
  debug('hasRequiredInputData')
  assert(isEmail(props.email), 'invalid email')
  assert(props.firstName, 'firstName required')
  assert(props.lastName, 'lastName required', )
  assert(props.username.length > 7, 'username not valid')
  assert(props.password.length > 7, 'password not valid') 
}

const hashPassword = async (password) => bcrypt.hash(password, 8)

const comparePassword = async (password, user) => {
  debug('comparePassword')
  let success = await bcrypt.compare(password, user.passwordHash)
  if(!success) throw new Error(errorMessages.authBadPassword())
  return user
}

// interface
class User {
  constructor(props){
    debug('constructor')
    this.id = 'user:' + uuid()
    this.email = props.email
    this.username = props.username
    this.lastName = props.lastName
    this.firstName = props.firstName
    this.passwordHash = props.passwordHash
    this.validate()
  }

  validate(){
    debug('validate')
    assert(this.id.startsWith('user:'), 'invalid id')
    assert(this.username.length > 7, 'invalid password')
    assert(isEmail(this.email), 'invalid email')
    assert(this.passwordHash, 'invalid passwordHash')
    assert(this.firstName, 'invlaid firstName')
    assert(this.lastName, 'invalid lastName')
  }

  toSafeJSON(){
    debug('toSafeJSON')
    return JSON.stringify(Object.assign({}, this, {passwordHash: undefined}))
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

module.exports = User
