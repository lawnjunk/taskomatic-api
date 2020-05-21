'use strict'

// external deps
const debug = require('debug')('app:auth-route')
const jsonParser = require('body-parser').json()
const {Router} = require('express')

// internal deps
const User = require('../model/user.js')
const hmac = require('../lib/hmac.js')
const basic = require('../middleware/basic-auth.js')

// route config 
const router = new Router()

router.post('/auth', jsonParser, async (req, res, next) => {
  debug('POST')
  let user = await User.createUser(req.body)
  let token = await user.createAuthToken()
  let signature = await hmac.hashData({token}, token)
  res.set('X-Taskomatic-Signature', signature)
  res.json({token})
})

router.get('/auth', basic, async (req, res, next) => {
  let {user} = req
  let token = await user.createAuthToken()
  let signature = await hmac.hashData({token}, token)
  res.set('X-Taskomatic-Signature', signature)
  res.json({token})
})

// interface
module.exports = router
