'use strict'

// external deps
const valid = require('valid.js')

// interface
const {isString} = valid.string
const {isEmail} = valid.util
const {isDate} = valid.date 
const isBool = (data) => typeof data === 'boolean'
const isEmpty = (data) => isUndefined(data) || isNull(data)
const isDefined = (data) => !isEmpty(data)
const isNumber = (data) => typeof data === 'number'
const isUndefined = (data) => typeof data === 'undefined'
const isFunction = (data) => typeof data === 'function'
const isObject = (data) => typeof data === 'object'
const isNull = (data) => data  === null
const isArray = (data) => data instanceof Array
const isSet = (data) => data instanceof Set
const isMap = (data) => data instanceof Map
const isPromise = (data) => data instanceof Promise


const base64Encode = (text) => Buffer.from(text).toString('base64')
const base64Decode = (text) => Buffer.from(text, 'base64').toString('ascii')


const toBool = (value) => {
    switch(typeof value){
      case 'boolean':
        return value
      case 'string':
        return  value === 'true'
      default:
        return false
    }
}

module.exports = {
  base64Encode,
  base64Decode,
  isDefined,
  isString, 
  isEmail,
  isDate,
  isBool,
  toBool,
}
