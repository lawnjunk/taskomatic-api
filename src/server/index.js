'use strict'

// external deps
const debug = require('debug')('app:main')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// internal moduels
const db = require('./lib/db.js')
let router = require('./route')
let errorMessage = require('./lib/error-message.js')
const errorMiddleware = require('./middleware/error-middleware.js')
const fourOhFourMiddleware = require('./middleware/fourohfour-middleware.js')

// module constants
const app = express()
  .use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })) 
  .use(morgan('common'))
  .use(router)
  .use(fourOhFourMiddleware)
  .use(errorMiddleware)


// module state
const state = {
  isOn: false,
  httpServer: null,
}

// interface
let start = () => {
  debug('start')
  return new Promise((resolve, reject) => {
    if (state.isOn) return reject(new Error(errorMessage.fatalBoot()))
    return db.init()
    .then(() => {
      state.httpServer = app.listen(process.env.PORT, (err) => {
        if (err) return reject(err)
        state.isOn = true
        console.log('SERVER IS RUNNING ON PORT ' + process.env.PORT)
        resolve(state)
      })
    })
  })
}

let stop = async () => {
  debug('stop')
  return new Promise((resolve, reject) => {
  if(!state.isOn) return reject(new Error(errorMessage.fatalShutdown()))
    db.quit()
    .catch(console.error)
    .finally(() => {
      state.httpServer.close((err) => {
        if(err) return reject(err)
        state.isOn = false
        state.httpServer = null
        console.log('SERVER SHUTDOWN COMPLETE')
        resolve(state)
      })
    })
  })
}

module.exports = {
  start,
  stop,
  state, 
}
