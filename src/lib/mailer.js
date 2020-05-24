'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)
const debug = require('debug')
const nodemailer = require('nodemailer')

// internal deps
const {base64Encode} = require('./util.js')

// module constants
const from = process.env.EMAIL_USER

const mail = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const helloworld = async () => {
  debug('helloworld')
  return await mail.sendMail({
    from, 
    to: 'slugbyte@slugbyte.com', 
    subject: 'supp?',
    text: 'helloworld yaww', 
  })
}


const verifyUserEmail = async (user) => { 
  debug('verifyUserEmail')
  let subject =`Welcome to Task-o-Matic ${user.firstName}`
  let base64Email = base64Encode(user.email)
  let html = `<h1>${subject}</h1>
<p>Please click link below to verify your email.</p>
<p><a href="${process.env.API_URL}/auth/verify/${base64Email}">CLICK TO VERIFY</a></p>
<strong>Thank you!</strong>`
  return await mail.sendMail({
    from, 
    html,
    subject,
    to: user.email,
  })
}

const notifyTaskCreate = async (user, task) => {
  debug('notifyTaskCreate')
  let subject =`HEY ${user.firstName.toUpperCase()}, YOU HAVE A NEW TASK!`
  let base64TaskID = base64Encode(task.id)
  let html = `<h1>${subject}<h1>
    <p>Click the the link below and verify accept the atask.</p>
    <h2>Task</h2>
    <p>${task.description}<p>
    <p><a href="${process.env.API_URL}/task/verify/${base64TaskID}">CLICK TO VERIFY</a></p>
    <strong>Thank you!</strong>`
  return await mail.sendMail({
    from, 
    html,
    subject,
    to: user.email,
  })
}

const notifyTaskExpire = async (user, task) => {
  debug('notifyTaskExpire')
  let subject =`Sorry ${user.firstName.toUpperCase()}, your task expired.`
  let html = `<h1>${subject}<h1>
    <h2>The following task has expired.</h2>
    <p>${task.description}<p>
    <strong>Have a nice day.</strong>`
  return await mail.sendMail({
    from, 
    html,
    subject,
    to: user.email,
  })
}

const notifyTaskComplete = async (user, task) => {
  debug('notifyTaskComplete')
  let subject =`Great Job ${user.firstName.toUpperCase()}!`
  let html = `<h1>${subject}<h1>
    <h2>You have complted the following task</h2>
    <p>${task.description}<p>
    <strong>Keep up the great work!</strong>`
  return await mail.sendMail({
    from, 
    html,
    subject,
    to: user.email,
  })
}

module.exports = {
  verifyUserEmail,
  notifyTaskCreate,
  notifyTaskComplete,
  notifyTaskExpire,
}
