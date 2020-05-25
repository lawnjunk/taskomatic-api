'use strict'

const debug = require('debug')('app:mailer')
const redis = require('redis')
// module state
let db = null

const start = async () => {
  debug('start')
  if(db) return 
  db = redis.createClient(process.env.REDIS_URI)
  db.on('message', () => console.log('TODO: handle message'))
  db.subscribe('mail_queue')
  console.log('MAILER UP AND RUNNING')
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

