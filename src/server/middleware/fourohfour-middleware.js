'use strict'
const createError = require('http-errors')

module.exports = (req, res, next) => 
    next(createError(404, `USER ERROR: ${req.url.path} not a route`))
