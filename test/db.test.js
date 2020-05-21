// external modules
require('dotenv').config(`${__dirname}/../.env`)

// internal modules
const db = require('../src/lib/db.js')

// test suite
describe('DB', () => {
  beforeAll(db.initClient)
  afterAll(db.quitClient)

  describe('writeItem', () => {
    it('should write and item that has an id', () => {
      return db.writeItem({id: "12345", content: "cool beans"})
      .then(item => {
        expect(item.id).toBe('12345')
        expect(item.content).toBe('cool beans')
      })
    })

    it('write item w/o id should throw an error', () => { 
      return db.writeItem({content: "cool beans"})
      .then(() => Promise.reject(new Error('failed')))
      .catch(err => {
        expect(err.message.startsWith('_DB_WRITE_ERROR_ id is required')).toBeTruthy()
      })
    })
  })
  
  describe('fetchItem', () => {
    it('should fetch the 12345 item', () => {
      return db.fetchItem({id: "12345"})
      .then(item => {
        expect(item.id).toBe('12345')
        expect(item.content).toBe('cool beans')
      })
    })

    it('bad id should resolve null', () => {
      return db.fetchItem({id: "54321"})
      .then(item => {
        expect(item).toBeNull()
      })
    })
  })

  describe('deleteItem', () => {
    it('should delete the 12345 item', () => {
      return db.deleteItem({id: "12345"})
      .then(count => {
        expect(count > 0).toBeTruthy()
      })
    })

    it('bad id should resolve null', () => {
      return db.fetchItem({id: "12345"})
      .then(item => {
        expect(item).toBeNull()
      })
    })
  })

})
