'use strict'

// external deps
const debug = require('debug')
const nodemailer = require('nodemailer')
const cowsay = require('cowsay')

// internal deps
const {base64Encode} = require('../server/lib/util.js')

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

const verifyUserEmail = async ({user}) => { 
  console.log('verifyUserEmail')
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

const notifyTaskCreate = async ({user, task}) => {
  console.log('notifyTaskCreate')
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

const notifyTaskExpire = async ({user, task}) => {
  console.log('notifyTaskExpire')
  let subject =`Sorry ${user.firstName.toUpperCase()}, your task expired.`
  let html = `<h1>${subject}<h1>
    <h2>The following task has expired.</h2>
    <pre>${cowsay.say({text: task.description})}</pre>
    <strong>Have a nice day.</strong>`
  return await mail.sendMail({
    from, 
    html,
    subject,
    to: user.email,
  })
}

const notifyTaskComplete = async ({user, task}) => {
  console.log('notifyTaskComplete')
  let subject =`Great Job ${user.firstName.toUpperCase()}!`
  let html = `<h1>${subject}<h1>
    <h2>You have complted the following task</h2>
    <pre>${cowsay.think({text: task.description})}</pre>
    <strong>Keep up the great work!</strong>`

  return await mail.sendMail({
    from, 
    html,
    subject,
    to: user.email,
  })
}

// interface
const router = {
  'VERIFY_USER_EMAIL': verifyUserEmail,
  'NOTIFY_TASK_CREATE': notifyTaskCreate,
  'NOTIFY_TASK_EXPIRE': notifyTaskExpire,
  'NOTIFY_TASK_COMPLETE': notifyTaskComplete,
}

module.exports = async (message) =>  {
  console.log('mailer message handler')
  let {action, data} = JSON.parse(message)

  let handler = router[action]
  if(!handler)
    return console.log(new Error(`NO SUCH MAIL TASK (${task})`))
  
  return await handler(data)
}
