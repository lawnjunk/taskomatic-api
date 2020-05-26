#!/usr/bin/env node
'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const mailer = require('../src/mailer')

// Gracefull shutdown
process.on('SIGINT', async () => {
  await mailer.stop().catch(() => process.exit(1))
  process.exit(0)
});

// program
const main = async () => {
  await mailer.start().catch(console.error)
}

main()
