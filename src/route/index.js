const {Router} = require('express')

let appRouter = new Router()
.get('/', (req, res) => {
  res.json({test: 'hello world'})
})

module.exports = appRouter
