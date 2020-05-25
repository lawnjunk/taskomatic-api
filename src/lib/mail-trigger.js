'use strict'

// external deps
const debug = require('debug')('app:mail-trigger')

// internal modules
const db = require('./db.js')

//interface
const triggerMessage = async (action, data) => {
  debug('triggerMessage', action)
  let message = JSON.stringify({action, data})
  return await db.doit('publish', ['mail_queue', message])
}

const verifyUserEmail = async (user) => {
  return await triggerMessage('VERIFY_USER_EMAIL', {user})
}
const notifyTaskCreate = async (user, task) => {
  return await triggerMessage('NOTIFY_TASK_CREATE', {user, task})
}
const notifyTaskExpire = async (user, task) => {
  return await triggerMessage('NOTIFY_TASK_EXPIRE', {user, task})
}
const notifyTaskComplete = async (user, task) => {
  return await triggerMessage('NOTIFY_TASK_COMPLETE', {user, task})
}

module.exports = {
  notifyTaskCreate,
  notifyTaskExpire,
  notifyTaskComplete,
  verifyUserEmail,
}
