/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let HistoryProvider;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;
const DBBaseProvider = require('./DBBaseProvider');

const HistorySchema = new Schema({
  url: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

HistorySchema.index({ updatedAt: -1 });

mongoose.model('History', HistorySchema);

const History = mongoose.model('History');

module.exports = HistoryProvider = class HistoryProvider extends DBBaseProvider {
  constructor() {
    super(History);
  }

  find(params) {
    return new Promise((resolve, reject) => {
      console.time('History findByIdAndUpdate');
      return History.find({})
        .sort({ updatedAt: -1 })
        .limit(params.limit - 0 || 20)
        .skip((params.page - 0 || 0) * params.limit)
        .exec(function(err, doc) {
          console.timeEnd('History findByIdAndUpdate');
          if (err) {
            return reject(err);
          }
          return resolve(doc);
        });
    });
  }

  upsert(params) {
    return new Promise((resolve, reject) => {
      console.log(params);
      const query = { url: params.url };
      const data = { url: params.url };
      data.updatedAt = Date.now();
      const options = { upsert: true };
      return resolve(this.update(query, data, options));
    });
  }
};
