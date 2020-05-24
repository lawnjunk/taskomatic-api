'use strict'

const valid = require('valid.js')

const {isString} = valid.string
const {isEmail} = valid.util
const {isDate} = valid.date 
const isBool = (value) => typeof value === 'boolean'
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
  isString, 
  isEmail,
  isDate,
  isBool,
  toBool,
}
