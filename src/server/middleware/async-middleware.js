'use stricrt'

// external modules
const debug = require('debug')('app:async')

module.exports = (fn) => (req, res, next) => {
  debug('async middleware')
  return Promise.resolve(fn(req, res, next)).catch(next)
}


