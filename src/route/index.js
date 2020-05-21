const {Router} = require('express')

const auth = require('./auth.js')  

let appRouter = new Router()
.use(auth)

module.exports = appRouter
