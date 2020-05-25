'use strict'

// external deps
require('dotenv').config(`${__dirname}/../.env`)

// internal modules
const db = require('../server/lib/db.js')
const mockTask = require('./mock/mock-task.js')
const mockUtil = require('./mock/mock-util.js')

// test suite
describe('DB', () => {
  beforeAll(db.init)
  afterEach(mockUtil.cleanup)
  afterAll(db.quit)

  describe('writeItem', () => {
    it('should write and item that has an id', async () => {
      let item = await mockUtil.writeItem({id: '12345', content: 'cool beans'})
      expect(item.id).toBe('12345')
      expect(item.content).toBe('cool beans')
    })

    it('write item w/o id should throw an error', async () => { 
      return db.writeItem({content: 'cool beans'})
      .then(() => Promise.reject(new Error('failed')))
      .catch(err => {
        expect(err.message.startsWith('_DB_WRITE_ERROR_')).toBeTruthy()
      })
    })
  })
  
  describe('fetchItem', () => {
    it('should fetch the 12345 item', async () => {
      let item = await mockUtil.writeItem({id: '12345', content: 'cool beans'})
      return db.fetchItem({id: '12345'})
      .then(item => {
        expect(item.id).toBe('12345')
        expect(item.content).toBe('cool beans')
      })
    })

    it('bad id should resolve null', async () => {
      let result = await db.fetchItem({id: '54321'})
      expect(result).toBeNull()
    })
  })
  
  describe('updateItem', () => {
    it('should update the 12345 item', async () => {
      let item = await mockUtil.writeItem({id: '12345', content: 'cool beans'})
      let result = await db.updateItem({id: '12345', content: 'snack'})
      expect(result.content).toBe('snack')
    })

    it('bad id should throw error', async () => {
      await db.updateItem({id: '12345', content: 'snack'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_UPDATE_ERROR_')).toBeTruthy()
      })
    })
  })

  describe('deleteItem', () => {
    it('should delete the 12345 item', async () => {
      let item = await mockUtil.writeItem({id: '12345', content: 'cool beans'})
      let result = await db.deleteItem({id: '12345'})
      expect(result).toBe(1)
    })

    it('bad id should resolve null', async () => {
      let result = await db.fetchItem({id: '12345'})
      expect(result).toBeNull()
    })
  })

  describe('addListItem', () => {
    afterAll(mockUtil.cleanup)

    it('add a list item', async () => {
      let item = await db.addListItem({
        id: 'food:789', 
        listID: 'food', 
        content: 'one'
      })

      expect(item.id).toBe('food:789')
      expect(item.listID).toBe('food')
      expect(item.content).toBe('one')
    })

    it('missing id, bad id, or missing listID should fail', async () => {
      await db.addListItem({id: 'food:123', content: 'one'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_ADD_LIST_')).toBeTruthy()
      })

      await db.addListItem({listID: 'food', content: 'one'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_ADD_LIST_')).toBeTruthy()
      })

      await db.addListItem({id: '1234', listID: 'food', content: 'one'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_ADD_LIST_')).toBeTruthy()
      })
    })
  })
  
  describe('updateListItem', () => {
    afterAll(async () => {
      await db.deleteItem({id: 'food:789'})
      await db.deleteItem({id: 'snack:1234'})
  })

    it('update a list item', async () => {
      await db.addListItem({id: 'food:789', listID: 'food', content: 'two'})
      let item = await db.updateListItem({
        id: 'food:789', 
        listID: 'food', 
        content: 'one'
      })

      expect(item.id).toBe('food:789')
      expect(item.listID).toBe('food')
      expect(item.content).toBe('one')
    })

    it('missing list item should fail', async () => {
      await db.updateListItem({id: 'snack:1234', listID: 'snack', content: 'one'})
      .then(() => {
        throw new Error('failed')
      })
      .catch(err => {
        expect(err.message.startsWith('_REDIS_UPDATE_ERROR')).toBeTruthy()
      })
    })

    it('missing id, bad id, or missing listID should fail', async () => {
      await db.updateListItem({id: 'food:123', content: 'one'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_update_LIST_')).toBeTruthy()
      })

      await db.updateListItem({listID: 'food', content: 'one'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_update_LIST_')).toBeTruthy()
      })

      await db.updateListItem({id: '1234', listID: 'food', content: 'one'})
      .catch(err => {
        expect(err.message.startsWith('_REDIS_update_LIST_')).toBeTruthy()
      })
    })
  })
  
  describe('fetchAllListItems', () => {
     it('should have three items', async () => {
       let result = await mockTask.getTasks()
       return db.fetchAllListItems({listID: 'task:' + result.user.email})
       .then(list => {
         expect(list.length).toBe(3)
         let ids = new Set(result.tasks.map(t => t.id))
         expect(ids.has(list[0].id)).toBeTruthy()
         expect(ids.has(list[1].id)).toBeTruthy()
         expect(ids.has(list[2].id)).toBeTruthy()
       })
     })
  })

  describe('deleteList', () => {
     it('should delete the list', async () => {
       let result = await mockTask.getTasks()
       return db.deleteList({listID: 'task:' + result.user.email}) 
       .then(count => {
         expect(count).toBe(3)
       })
     })
  })
})
