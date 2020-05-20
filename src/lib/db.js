// external deps
const debug = require('debug')('app:db')
const {promisify} = require('util')
const redis = require('redis')

// internal deps
const errorMessage = require(`${__dirname}/error-message.js`)

// modual constants
const state = {
  client: null
  methods: {},
}

// helper functions
const resetState = (){
  state.client = null
  state.methods = {}
}

const createClientMethod = (method) => {
  debug(method)
  return promisify(client[method]).bind(client)
}

const createClientMethodInterface = (method) => (...args) => {
  if(!state[method]) 
    return Promise.reject(new Error(errorMessage.redisMethodCallFail(method)))
  return state[method](...args)
}

// initClient sets up a redis connection and creates smart db request methods
const initClient = () => {
  debug('initClient')
  return new Promise((resolve, reject) => {
    if(state.client) return reject(new Error(errorMessage.fatalRedisInit))
    try {
      state.client = redis.createClient(process.env.REDIS_URI) 
    } catch (err){
      if (err) return reject(err)
    }
    state.client.on('error', (err) => {
      debug('__DB_ERROR__')
      console.error(err)
    })
    state.methods = ['get', 'set', 'hmset', 'hgetall', 'quit']
      .reduce((prop, result) => {...result, [prop]: createClientMethod(prop)})
    return state.client
  })
}

const quitClient = () => {
  debug('quitClient')
  return new Promise((resolve, reject) => {
    if(!state.client) return reject(new Error(errorMessage.fatalRedisQuit))
    return state.methods.quit()
    .then((result) => {
      resetState() 
      return result
    })
  })
}

// interface
module.exports = {
  initClient,
  quitClient, 
  set: createClientMethodInterface('set'),
  get: createClientMethodInterface('get'),
  hmset: createClientMethodInterface('hmset'),
  hgetall: createClientMethodInterface('hgetall'),
  quit: createClientMethodInterface('quit'),
  state,
}
