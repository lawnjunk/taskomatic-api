'use strict'

// external deps
const debug = require('debug')
const {Router} = require('express')
const createError = require('http-errors')
const jsonParser = require('body-parser').json()

// internal modules
const db = require('../lib/db.js')
const User = require('../model/user.js')
const bearer = require('../middleware/bearer-auth.js')
const signing = require('../middleware/signing-middleare.js')
const asyncMiddleware = require('../middleware/async-middleware.js')

// module constats
const profileRouter = new Router()

// interface
profileRouter.get('/profile/self', bearer, signing, asyncMiddleware(async (req, res) => {
  debug('GET /pofile/self')
  res.signJSON(JSON.parse(req.user.toSafeJSON()))
}))

profileRouter.put('/profile/self', bearer, jsonParser, signing, asyncMiddleware(async (req, res) => {
  debug('PUT /pofile/self')
  let result = await req.user.updateProfile(req.body)
  res.signJSON(JSON.parse(result.toSafeJSON()))
}))

profileRouter.get('/profile', bearer, signing, asyncMiddleware(async (req, res) => {
  debug('GET /profile')
  let userKeys = await db.doit('keys', ['user:*'])
  let userProfiles = await Promise.all(userKeys.map(async (key) => {
    let user = await User.fetchByID(key)
    return JSON.parse(user.toSafeJSON())
  }))
  res.signJSON(userProfiles)
}))

module.exports = profileRouter
