'use strict'

// external deps
const debug = require('debug')('app:mailer')
const redis = require('redis')

// internal modules
const messageHandler = require('./message-handler.js')

// module state
let db = null

// interface
const start = async () => {
  debug('start')
  if(db) return 
  db = redis.createClient(process.env.REDIS_URI)
  db.on('message', (channel, message) => messageHandler(message))
  db.subscribe('mail_queue')
  debug('MAILER UP AND RUNNING')
}

const stop = async () => {
  debug('stop')
  if(!db) return
  await db.unsubscribe('mail_queue')
  await db.quit()
  db = null
}

module.exports = {
  start,
  stop,
}

