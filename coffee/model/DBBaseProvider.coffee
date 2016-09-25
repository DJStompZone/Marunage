_        = require 'lodash'
chalk    = require 'chalk'
moment   = require 'moment'
configs  = require('konfig')()
mongoose = require 'mongoose'
uri      = process.env.MONGOLAB_URI || configs.app.MONGODB_URI
db       = mongoose.connect uri

module.exports = class DBBaseProvider

  constructor: (@Model) ->
    console.log @Model.modelName

  findByIdAndUpdate: (_id, data, options) ->
    return new Promise (resolve, reject) =>
      console.log chalk.green "DBBaseProvider #{@Model.modelName} findByIdAndUpdate"
      console.log _id
      console.log data
      console.log options
      console.time "#{@Model.modelName} findByIdAndUpdate"
      @Model.findByIdAndUpdate _id, data, options, (err, doc) =>
        console.timeEnd "#{@Model.modelName} findByIdAndUpdate"
        if err then return reject err
        return resolve doc

  findOneAndUpdate: (query, data, options) ->
    return new Promise (resolve, reject) =>
      console.log chalk.green "DBBaseProvider #{@Model.modelName} findOneAndUpdate"
      console.log query
      console.log data
      console.log options
      console.time "#{@Model.modelName} findOneAndUpdate"
      @Model.findOneAndUpdate query, data, options, (err, doc) =>
        console.timeEnd "#{@Model.modelName} findOneAndUpdate"
        if err then return reject err
        return resolve doc

  save: (data) ->
    return new Promise (resolve, reject) =>
      console.log chalk.green "DBBaseProvider #{@Model.modelName} save"
      console.time "#{@Model.modelName} save"
      data.save (err, doc) =>
        console.timeEnd "#{@Model.modelName} save"
        if err then return reject err
        return resolve doc

  update: (query, data, options) ->
    return new Promise (resolve, reject) =>
      console.log chalk.green "DBBaseProvider #{@Model.modelName} update"
      console.log query
      console.log data
      console.log options
      console.time "#{@Model.modelName} update"
      @Model.update query, data, options, (err) =>
        console.timeEnd "#{@Model.modelName} update"
        if err then return reject err
        return resolve 'update ok'

  remove: (query, data, options) ->
    return new Promise (resolve, reject) =>
      console.log chalk.green "DBBaseProvider #{@Model.modelName} remove"
      console.log query
      console.log data
      console.log options
      console.time "#{@Model.modelName} remove"
      @Model.remove query, (err) =>
        console.timeEnd "#{@Model.modelName} remove"
        if err then return reject err
        return resolve 'remove ok'
