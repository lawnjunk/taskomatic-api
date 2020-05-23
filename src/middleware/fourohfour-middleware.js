'use strict'

module.exports = (req, res, next) => 
    next(createError(404, `USER ERROR: ${req.url.path} not a route`))
