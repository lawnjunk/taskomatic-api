'use strict'
// external deps
const debug = require('debug')('app:task')
const uuid = require('uuid').v1
const createError = require('http-errors')
const valid = require('valid.js')
const assert = require('assert')

// internal deps
const db = require('../lib/db.js')
const User = require('./user.js')

// helper methods
const {isString} = valid.string
const {isEmail} = valid.util
const {isDate} = valid.date 
const isBool = (value) => typeof value === 'boolean'

const hasRequiredInputData = async (props) => {
  debug('hasRequiredInputData')
  assert(props.user instanceof User, 
    createError(400, 'invalid user'))
  assert(isString(props.description), 
    createError(400, 'invalid descrption'))
}

// interface
class  Task {
  constructor(props){
    debug('constructor')
    this.id = props.id || 'task:' + props.user.email + ':' + uuid()
    this.listID = props.listID || 'task:' + props.user.email
    this.userID = props.userID || props.user.id
    this.description = props.description
    this.timestamp = props.timestamp ? new Date(props.timestamp): new Date()
    this.draft = true

    switch(typeof props.completed){
      case 'boolean':
        this.completed = props.completed 
        break
      case 'string':
        this.completed = props.completed === 'true'
        break
      default:
        this.completed = false
    }

    this.validate()
  }

  validate(){
    debug('validate')
    assert(isString(this.id),
      createError(400, 'invalid id'))
    assert(isString(this.listID),
      createError(400, 'invalid listID'))
    assert(isString(this.userID),
      createError(400, 'invalid userID'))
    assert(isString(this.description),
      createError(400, 'invalid description'))
    assert(isBool(this.completed),
      createError(400, 'invalid completed')) 
    assert(isDate(this.timestamp),
      createError(400, 'invalid date'))
  }

  async update(props={}){
    debug('update')
    if (props.description)
      this.description = props.description
    if(isBool(props.completed))
      this.completed = props.completed
    this.validate()
    await db.updateListItem(this)
    if(this.draft == false)
      await db.doit('persist', [this.id]) // MAGIC NUM is 24hrs in seconds
    return this
  }

  async delete(){
    debug('delete')
    await db.deleteItem({id: this.id})
  }
}

Task.createTask = async (props) => {
  debug('createTask')
  await hasRequiredInputData(props)
  let task = new Task(props)
  await db.addListItem(task)
  await db.doit('expire', [task.id, 86400]) // MAGIC NUM is 24hrs in seconds
  return task
}

Task.fetchTaskById = async (id) => {
  debug('fetchById')
  let task = await db.fetchItem({id: id})
  return task ? new Task(task) : null
}

Task.fetchTaskListByUserEmail = async (email) => {
  debug('fetchTaskListByUserEmail')
  let tasks = await db.fetchAllListItems({listID: 'task:' + email})
  return tasks.map(task => new Task(task))
}

Task.deleteTaskListByUserEmail = async (email) => {
  debug('deleteTaskListByUserEmail')
  return await db.deleteList({listID: 'task:' + email})
}

module.exports = Task
