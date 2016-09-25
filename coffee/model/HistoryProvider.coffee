_              = require 'lodash'
mongoose       = require 'mongoose'
Schema         = mongoose.Schema
ObjectId       = Schema.ObjectId
DBBaseProvider = require "./DBBaseProvider"

HistorySchema = new Schema
  url:
    type: String
    unique: true
  createdAt:
    type: Date
    default: Date.now()

HistorySchema.index {createdAt: -1}

mongoose.model 'History', HistorySchema

History = mongoose.model 'History'

module.exports = class HistoryProvider extends DBBaseProvider

  constructor: () ->
    super(History)

  find: ->
    return new Promise (resolve, reject) =>
      console.time "History findByIdAndUpdate"
      History.find {}
      .sort updatedAt: -1
      .exec (err, doc) ->
        console.timeEnd "History findByIdAndUpdate"
        if err then return reject err
        return resolve doc

  upsert: (params) ->
    return new Promise (resolve, reject) =>
      console.log params
      query = url: params.url
      data = url: params.url
      data.updatedAt = Date.now()
      options = upsert: true
      return resolve @update(query, data, options)
