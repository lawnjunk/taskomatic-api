'use strict'

// external deps
const debug = require('debug')('app:auth-route')
const jsonParser = require('body-parser').json()
const {Router} = require('express')

// internal deps
const User = require('../model/user.js')
const hmac = require('../lib/hmac.js')
const basic = require('../middleware/basic-auth.js')
const bearer = require('../middleware/bearer-auth.js')
const signing = require('../middleware/signing-middleare.js')
const mailTrigger = require('../lib/mail-trigger.js')
const util = require('../lib/util.js')

// route config 
const router = new Router()

router.post('/auth', jsonParser, async (req, res) => {
  debug('POST')
  let user = await User.createUser(req.body)
  let token = await user.createAuthToken()
  let signature = await hmac.hashData({token}, token)
  res.set('X-Taskomatic-Signature', signature)
  await mailTrigger.verifyUserEmail(user)
  res.json({token})
})

router.get('/auth', basic, async (req, res) => {
  debug('GET /auth')
  let {user} = req
  let token = await user.createAuthToken()
  let signature = await hmac.hashData({token}, token)
  res.set('X-Taskomatic-Signature', signature)
  res.json({token})
})

router.put('/auth', bearer, jsonParser, async (req, res) => {
  debug('PUT /auth')
  await req.user.updatePassword(req.body.password)
  res.sendStatus(200)
})


router.get('/auth/verify/:id', async (req, res) => {
  debug('GET /auth/verify/:id')
  let email = util.base64Decode(req.params.id)
  let user = await User.fetchByEmail(email)
  await user.verifyEmail()
  let backURL = req.header('Referer') || process.env.CLIENT_URL
  res.redirect(backURL)
})

// interface
module.exports = router
