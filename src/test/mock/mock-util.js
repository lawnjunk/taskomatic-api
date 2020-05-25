'use strict'
// external mods
const debug = require('debug')('app:mock-util')

const db = require('../../server/lib/db.js')

const writeItem = async (item) => {
  if(process.env.VERBOSE)
    debug('writeItem')
  await db.writeItem(item)
  return item
}

const cleanup = async () => {
  debug('cleanup')
  let result = await db.doit('flushall')
}

module.exports = {
  writeItem, 
  cleanup, 
  init: db.initClient, 
  quit: db.quitClient
}

