#!/usr/bin/env node
'use strict'

require('dotenv').config({path: `${__dirname}/../.env`})
const server = require('../src/server')

// Gracefull shutdown
process.on('SIGINT', async () => {
  await server.stop().catch(() => process.exit(1))
  process.exit(0)
});

// program
async function main(){
  await server.start()
}

main()
