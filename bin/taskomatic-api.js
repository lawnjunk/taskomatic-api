#!/usr/bin/env node
'use strict'

require('dotenv').config({path: `${__dirname}/../.env`})
const server = require('../src/server')

async function main(){
  await server.start()
}

main()
