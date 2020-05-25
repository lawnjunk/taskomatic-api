'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal deps
const mailer = require('../src/lib/mailer.js')

const main = async () => {
  await mailer.start().catch(console.error)
}

main()
