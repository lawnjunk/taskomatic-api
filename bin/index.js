'use strict'

require('dotenv').config({path: `${__dirname}/../.env`})
const server = require('../src/lib/server.js')

async function main(){
  await server.start()
  await server.stop()
}

main()
