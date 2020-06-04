'use strict'

const debug = require('debug')('app:error')

// interface
module.exports = (err, req, res, next) => {
  debug('error middleware')
  console.error(err)
  if(err.status)
      return res.sendStatus(err.status)
  res.sendStatus(500)
}
