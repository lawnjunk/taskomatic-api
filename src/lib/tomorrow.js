'use strict'

// external deps
const debug = require('debug')('app:tomorrow')

// module constants
// 24.5 hours in milliseconds
const tomorrowTimeout = 88200000  

// cache
const cache = {} 

const clear = (id) => {
  debug('clear')
  if(cache[id]){
    clearInterval(cache[id])
    delete cache[id]
  }
}

const register = (id, callback, timeoutOverride) => {
  debug('register')
  let intervalID = setTimeout(() => {
    callback()
    clear(id)
  }, timeoutOverride || tomorrowTimeout)

  cache[id] = intervalID
  return {id, intervalID}
}


module.exports = {register, clear, cache}
