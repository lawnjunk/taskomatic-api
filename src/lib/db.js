// external deps
const debug = require('debug')('app:db')
const {promisify} = require('util')
const redis = require('redis')

// internal deps
const errorMessage = require(`./error-message.js`)

// modual constants
const state = {
  client: null,
  methods: {},
}

// helper functions
const resetState = () => {
  state.client = null
  state.methods = {}
}

// throws error if Client doesnt exist
// returns undefined
const assertClientExists = (client) => {
  if(process.env.VERBOSE)
    debug('assertClientExists')
  if(!(client ||state.client))
    throw new Error('_NO_CLIENT_ERROR_')
}

const assertMethodExists= (method) => {
  if(process.env.VERBOSE)
    debug('assertMethodExists')
  if(!state.methods[method])
    throw new Error(errorMessage.redisMethodCallFail(method))
}

// CURRY_FUNK that wraps interface methods to assert the client exists
const protectInterfaceMethod = (fn) => async (...args) => {
  assertClientExists()
  return await fn(...args)
}

// returns result of client method')
const doit = async (method, ...args) => {
  assertClientExists(method)
  return await state.methods[method](...args)
}

// makes a promisifed client method
const createClientMethod = (method) => {
  if(process.env.VERBOSE)
    debug(`createClientMethod ${method}`)
  assertClientExists()
  return promisify(state.client[method]).bind(state.client)
}

// returns client
const promisifyClientMethods = (client) => {
  debug('promisifyClientMethods')
  assertClientExists(client)
  state.methods = Object.keys(Object.getPrototypeOf(state.client))
    .filter(prop => (typeof state.client[prop]) == 'function')
    .reduce((result, prop) => 
      ({[prop]: createClientMethod(prop), ...result}), {})
  return client
}

const handleClientEvents = (client) => {
  debug('handleClientEvents')
  assertClientExists(client)
  client.on('error', (err) => {
    debug('__DB_ERROR_EVENT__')
    console.error(err)
  })
}

// resolves the client
const initClient = async () => {
  debug('initClient')
  if(state.client) throw new Error(errorMessage.fatalRedisInit)
  state.client = redis.createClient(process.env.REDIS_URI) 
  handleClientEvents(state.client)
  promisifyClientMethods(state.client)
  return state.client
}

const quitClient = async () => {
  debug('quitClient')
  let result = await doit('quit') 
  resetState()
  return result
}

// resolves item fetched
const writeItem = async (item) => {
  debug('writeItem')
  let {id} = item
  if(!id) throw new Error(errorMessage.redisIDWriteError())
  let keys = Object.keys(item)
  let values = Object.values(item)
  let hmsetValues = []
  keys.forEach((key, i) => {
    hmsetValues.push(key)
    hmsetValues.push(values[i])
  })
  await doit('hmset', id, ...hmsetValues)
  return item
}

// resolves item fetched
const fetchItem = async (item) => {
  debug('fetchItemByID')
  if(!item.id) throw new Error(errorMessage.redisIDReadError())
  return await doit('hgetall', item.id)
}

// resolves number deleted
const deleteItem = async (item) => {
  debug('deleteItemByID')
  if(!item.id)
    throw new Error(errorMessage.redisIDDeleteError())
  return await doit('del', item.id)
}

const deleteList = async (item) => deleteItem({id: item.listID})

// resolves item that was pushed
const pushListItem = async (item) => {
  debug('pushListItem')
  if(!item.listID) 
    throw new Error(errorMessage.redisMethodCallFail('lpush'))
  let json = JSON.stringify(item)
  await doit('lpush', item.listID, json)
  return item
}

// resolves length of list
const fetchAllListItems = async (item) => {
  let {llen, lrange} = state.methods
  let length = await doit('llen', item.listID)
  let list = await doit('lrange', item.listID, 0, length + 1)
  return list.map(JSON.parse)
}

// interface
module.exports = {
  initClient, // cant protect client if it dont exist :)
  quitClient: protectInterfaceMethod(quitClient),
  writeItem: protectInterfaceMethod(writeItem),
  fetchItem: protectInterfaceMethod(fetchItem), 
  deleteItem: protectInterfaceMethod(deleteItem),
  deleteList: protectInterfaceMethod(deleteList),
  pushListItem: protectInterfaceMethod(pushListItem),
  fetchAllListItems: protectInterfaceMethod(fetchAllListItems),
  state,
}
