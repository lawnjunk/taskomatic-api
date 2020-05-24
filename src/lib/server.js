'use strict'

// external deps
const debug = require('debug')('app:main')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// internal deps 
const db = require('./db.js')
let router = require('../route')
let errorMessage = require('./error-message.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const fourOhFourMiddleware = require('../middleware/fourohfour-middleware.js')

// module constants
const app = express()
  .use(morgan('common'))
  .use(cors()) // TODO: setup CORS ORIGIN
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
    return db.initClient()
    .then(() => {
      state.httpServer = app.listen(process.env.PORT, (err) => {
        if (err) return reject(err)
        state.isOn = true
        debug('SERVER IS RUNNING ON PORT ' + process.env.PORT)
        resolve(state)
      })
    })
  })
}

let stop = async () => {
  debug('stop')
  return new Promise((resolve, reject) => {
  if(!state.isOn) return reject(new Error(errorMessage.fatalShutdown()))
    db.quitClient()
    .catch(console.error)
    .finally(() => {
      state.httpServer.close((err) => {
        if(err) return reject(err)
        state.isOn = false
        state.httpServer = null
        debug('SERVER SHUTDOWN COMPLETE')
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
