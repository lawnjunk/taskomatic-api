#!/usr/bin/env node
'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const mailer = require('../src/mailer')

const main = async () => {
  await mailer.start().catch(console.error)
}

main()
