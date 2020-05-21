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

const createClientMethod = (method) => {
  debug(`createClientMethod ${method}`)
  if (!state.client) throw new Error('no client found')
  return promisify(state.client[method]).bind(state.client)
}

// initClient sets up a redis connection and creates smart db request methods
const initClient = async () => {
  debug('initClient')
  if(state.client) 
    throw new Error(errorMessage.fatalRedisInit)
  state.client = redis.createClient(process.env.REDIS_URI) 
  state.client.on('error', (err) => {
    debug('__DB_ERROR_EVENT__')
    console.error(err)
  })
  state.methods = Object.keys(Object.getPrototypeOf(state.client))
    .concat(['quit'])
    .filter(prop => (typeof state.client[prop]) == 'function')
    .reduce((result, prop) => 
      ({[prop]: createClientMethod(prop), ...result}), {})
  return state.client
}

const quitClient = async () => {
  debug('quitClient')
  if(!state.client) 
    throw new Error(errorMessage.fatalRedisQuit)
  let result = await state.methods.quit()
  resetState()
  return result
}

const writeItem = async (item) => {
  debug('writeItem')
  let {hmset} = state.methods
  if(!hmset) 
    throw new Error(errorMessage.redisMethodCallFail('hmset'))
  let {id} = item
  if(!id)
    throw new Error(errorMessage.redisIDWriteError())
  let keys = Object.keys(item)
  let values = Object.values(item)
  let hmsetValues = []
  keys.forEach((key, i) => {
    hmsetValues.push(key)
    hmsetValues.push(values[i])
  })
  await hmset(id, ...hmsetValues)
  return item
}

const fetchItem = async (item) => {
  debug('fetchItemByID')
  let {hgetall} = state.methods  
  if(!hgetall) 
    throw new Error(errorMessage.redisMethodCallFail('hgetall'))
  if(!item.id)
    throw new Error(errorMessage.redisIDReadError())
  return await hgetall(item.id)
}

const deleteItem = async (item) => {
  debug('deleteItemByID')
  let {del} = state.methods
  if (!del) 
    throw new Error(errorMessage.redisMethodCallFail('hdel'))
  if(!item.id)
    throw new Error(errorMessage.redisIDDeleteError())
  return await del(item.id)
}

const listPushItem = async (item) => {
  let {lpush} = state.methods
  if(!lpush) 
    throw new Error(errorMessage.redisMethodCallFail('lpush'))
  let listId = item.listId
  let json = JSON.stringify(item)
  // TODO: return the await
  return await lpush(id, json)
}

const listFetchAllById  = async (id) => {
  let {llen, lrange} = state.methods
  if(!llen) 
    throw new Error(errorMessage.redisMethodCallFail('llen'))
  if(!lrange) 
    throw new Error(errorMessage.redisMethodCallFail('lrange'))
  let length = await llen(id)
  let list = await lrange(0, length + 1)
  return list.map(JSON.parse)
}


// interface
module.exports = {
  initClient,
  quitClient, 
  writeItem,
  fetchItem, 
  deleteItem,
  state,
}
