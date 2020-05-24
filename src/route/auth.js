'use strict'

// external deps
const debug = require('debug')('app:auth-route')
const jsonParser = require('body-parser').json()
const {Router} = require('express')

// internal deps
const User = require('../model/user.js')
const hmac = require('../lib/hmac.js')
const basic = require('../middleware/basic-auth.js')
const signing = require('../middleware/signing-middleare.js')
const mailer = require('../lib/mailer.js')
const util = require('../lib/util.js')

// route config 
const router = new Router()

router.post('/auth', jsonParser, async (req, res, next) => {
  debug('POST')
  let user = await User.createUser(req.body)
  let token = await user.createAuthToken()
  let signature = await hmac.hashData({token}, token)
  res.set('X-Taskomatic-Signature', signature)
  // TODO: respond to client before sending email without tests hanging
  await mailer.verifyUserEmail(user).catch(console.error) 
  res.json({token})
})

router.get('/auth', basic, async (req, res, next) => {
  let {user} = req
  let token = await user.createAuthToken()
  let signature = await hmac.hashData({token}, token)
  res.set('X-Taskomatic-Signature', signature)
  res.json({token})
})

router.get('/auth/verify/:email', async (req, res) => {
  let email = util.base64Decode(req.params.email)
  let user = await User.fetchByEmail(email)
  await user.update({verified: true})
  let backURL = req.header('Referer') || process.env.CLIENT_URL
  res.redirect(backURL)
})

// interface
module.exports = router
