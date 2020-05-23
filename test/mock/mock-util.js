'use strict'
// external mods
const debug = require('debug')('app:mock-util')

// TODO: add cache here
const db = require('../../src/lib/db.js')

// module state
let cache = []

// interface
const cacheItem = (item) => {
  if(process.env.VERBOSE)
    debug('cacheItem', item.id)
  cache.push(item)
}

const writeItem = async (item) => {
  if(process.env.VERBOSE)
    debug('writeItem')
  await db.writeItem(item)
  cacheItem(item)
  return item
}

const cleanup = async () => {
  debug('cleanup')
  await Promise.all(cache.map(async (item) => {
    await db.deleteItem(item)
  }))
  cache = []
}

module.exports = {cacheItem, writeItem, cleanup}

