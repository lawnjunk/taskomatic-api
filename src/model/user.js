'use strict'
// external deps
const debug = require('debug')('app:user')
const uuid = require('uuid').v1
const assert = require('assert')
const bcrypt = require('bcrypt')
const {isEmail}  = require('valid.js').util

// internal deps
const db = require('../lib/db.js')

// helper methods
const hasRequiredProps = (props) => {
  debug('hasRequiredProps')
  return new Promise((resolve, reject) => {
    try {
      assert(isEmail(props.email), 'invalid email')
      assert(props.firstName, 'firstName required')
      assert(props.lastName, 'lastName required', )
      assert(props.username.length > 7, 'username not valid')
      // could make better validation later
      assert(props.password.length > 7, 'password not valid') 
      resolve()
    } catch (err){
      reject(err)
    }
  })
}

const hashPassword = (password) => {
  debug('hashPassword')
  return bcrypt.hash(password, 8)
}

const comparePassword = (password, user) => {
  debug('comparePassword')
  return bcrypt.compare(password, user.passwordHash)
  .then(success => {
    if(!success) return Promise.reject(new Error('Incorrect Password'))
    return user
  })
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
  await hasRequiredProps(props)
  console.log('boom')
  let passwordHash = await hashPassword(props.password)
  console.log('bing')
  let user = new User({passwordHash, ...props})
  console.log(user)
  db.storeObject(user)
  return user
}

module.exports = User
