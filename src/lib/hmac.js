'use strict'

// external deps
const crypto = require('crypto')

// interface
// resolves a hash
const hashData = (data, secret) => {
  return new Promise((resolve, reject) => {
    let hmac = crypto.createHmac('sha256', secret)
    hmac.on('readable', () => {
      let result = hmac.read()
      if(!result)
        return reject(new Error('_HMAC_ERROR_ failed to encrypt data'))
      resolve(result.toString('hex'))
    })
    hmac.on('error', reject)
    hmac.write(JSON.stringify(data))
    hmac.end()
  })
}

// resolves data 
const verify = async (data, hash, secret) => {
  let result = await hashData(data, secret)
  if(result !== hash)
    throw new Error('_HMAC_ERROR_ verification of data failed')
  return data
}

module.exports = {
  hashData,
  verify,
}
