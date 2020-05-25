'use strict'

// external deps
const valid = require('valid.js')

// interface
const {isString} = valid.string
const {isEmail} = valid.util
const {isDate} = valid.date 
const isBool = (value) => typeof value === 'boolean'
const isDefined = (value) => value != undefined && value != null
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
