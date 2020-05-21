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

  describe('pushListItem', () => {
    it('push a list item', () => {
      return db.pushListItem({id: "789", listID: 'food', content: "one"})
      .then(item => {
        expect(item.id).toBe('789')
        expect(item.listID).toBe('food')
        expect(item.content).toBe('one')
      })
    })

    it('push a list item', () => {
      return db.pushListItem({id: "800", listID: 'food', content: "two"})
      .then(item => {
        expect(item.id).toBe('800')
        expect(item.listID).toBe('food')
        expect(item.content).toBe('two')
      })
    })

    it('push a list item', () => {
      return db.pushListItem({id: "801", listID: 'food', content: "three"})
      .then(item => {
        expect(item.id).toBe('801')
        expect(item.listID).toBe('food')
        expect(item.content).toBe('three')
      })
    })

  })
  
  describe('fetchAllListItems', () => {
     it('should have three items', () => {
       return db.fetchAllListItems({listID: 'food'})
       .then(list => {
         expect(list.length).toBe(3)
         expect(list[0].id).toBe('801')
         expect(list[1].id).toBe('800')
         expect(list[2].id).toBe('789')
       })
     })
  })

  describe('deleteList', () => {
     it('should delete the list', () => {
       return db.deleteList({listID: 'food'})
       .then(count => {
         expect(count).toBe(1)
       })
     })
  })
})
