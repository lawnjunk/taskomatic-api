'use strict'

// external deps
const createError = require('http-errors')

// interface
module.exports = (req, res, next) => 
    next(createError(404, `USER ERROR: ${req.url.path} not a route`))
