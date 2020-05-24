'use strict'

// external deps
const debug = require('debug')('app:tomorrow')

// module constants
// 24.5 hours in milliseconds
const  tomorrowTimeout = 88200000 

// cache
const cache = {} 

const register = (id, callback) => {
  debug('register')
  let intervalID =  setTimeout(callback, tomorrowTimeout)
  return 
}

const clear = (id) => {
  debug('clear')
  if(cache[i]){
    clearInterval(cache[id])
    delete cache[id]
  }
}

module.exports = {register, clear}
