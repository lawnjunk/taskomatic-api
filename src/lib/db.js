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

const objectToArray = (data) => {
  let keys = Object.keys(data)
  let values = Object.values(data)
  let result = []
  keys.forEach((key, i) => {
    result.push(key)
    result.push(values[i])
  })
  return result
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
  debug('writeItem', item.id)
  let {id} = item
  if(!id) throw new Error(errorMessage.redisIDWriteError())
  await doit('hmset', id, objectToArray(item))
  return item
}

// resolves item fetched
const fetchItem = async (item) => {
  debug('fetchItem')
  if(!item.id) throw new Error(errorMessage.redisIDReadError())
  return await doit('hgetall', item.id)
}

const updateItem = async(item) => {
  debug('updateItem')
  // TODO: make update error
  if(!item.id) throw new Error(errorMessage.redisIDReadError()) 
  let exists = await doit('exists', item.id)
  if (exists !== 1) 
    throw new Error('_REDIS_UPDATE_ERROR_ item does not exist')
  return await writeItem(item)
}

// resolves number deleted
const deleteItem = async (item) => {
  debug('deleteItem', item.id)
  if(!item.id)
    throw new Error(errorMessage.redisIDDeleteError())
  return await doit('del', item.id)
}

//NOTE: "List" in this module is an Unordered list using hashs
// not the redis List data type

// resolves the list Item
const addListItem = async (item) => {
  debug('addListItem')
  if(!item.listID) 
    throw new Error('_REDIS_ADD_LIST_ITEM_ERROR_ listID required')
  if(!item.id) 
    throw new Error('_REDIS_ADD_LIST_ITEM_ERROR_ id required')
  if(!item.id.startsWith(item.listID)) 
    throw new Error('_REDIS_ADD_LIST_ITEM_ERROR_ id must start with listID')
  return writeItem(item)
}

// resolves al keys in a given list
const getListKeys = async (item) => {
  debug('getListKeys')
  if(!item.listID) 
    throw new Error('_REDIS_GET_LIST_KEYS_ERROR_ listID required')
  return await doit('keys', item.listID + '*')
}

const updateListItem = async (item) => {
  debug('updateListItem')
  if(!item.listID) 
    throw new Error('_REDIS_update_LIST_ITEM_ERROR_ listID required')
  if(!item.id) 
    throw new Error('_REDIS_update_LIST_ITEM_ERROR_ id required')
  if(!item.id.startsWith(item.listID)) 
    throw new Error('_REDIS_update_LIST_ITEM_ERROR_ id must start with listID')
  return updateItem(item)
}

// resolves number of items deleted
const deleteList = async (item) => {
  debug('deleteList')
  if(!item.listID) 
    throw new Error('_REDIS_DELETE_LIST_ERROR_ listID required')
  let keys = await getListKeys(item)
  return await doit('del', keys)
}

// resloves all the list items
const fetchAllListItems = async (item) => {
  debug('fetchAllListItems')
  if(!item.listID) 
    throw new Error('_REDIS_FETCH_LIST_ITEMS_ERROR listID required')
  let keys = await getListKeys(item)
  let list = await Promise.all(keys.map(async (key) => {
    return await fetchItem({id: key})
  }))
  // TODO: sort?
  return list
}

// interface
module.exports = {
  state,
  initClient, // cant protect client if it dont exist :)
  quitClient: protectInterfaceMethod(quitClient),
  doit: protectInterfaceMethod(doit),
  // Items
  writeItem: protectInterfaceMethod(writeItem),
  fetchItem: protectInterfaceMethod(fetchItem), 
  updateItem: protectInterfaceMethod(updateItem),
  deleteItem: protectInterfaceMethod(deleteItem),
  // List Items
  addListItem: protectInterfaceMethod(addListItem),
  getListKeys: protectInterfaceMethod(getListKeys),
  updateListItem: protectInterfaceMethod(updateListItem),
  deleteList: protectInterfaceMethod(deleteList),
  fetchAllListItems: protectInterfaceMethod(fetchAllListItems),
}
