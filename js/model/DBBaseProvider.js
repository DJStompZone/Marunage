const chalk = require('chalk');
const configs = require('konfig')();
const mongoose = require('mongoose');
const uri = process.env.MONGOLAB_URI || configs.app.MONGODB_URI;
const db = mongoose.connect(uri);

module.exports = class DBBaseProvider {
  constructor(Model) {
    this.Model = Model;
    console.log(this.Model.modelName);
  }

  findByIdAndUpdate(_id, data, options) {
    return new Promise((resolve, reject) => {
      console.log(
        chalk.green(`DBBaseProvider ${this.Model.modelName} findByIdAndUpdate`),
      );
      console.log(_id);
      console.log(data);
      console.log(options);
      console.time(`${this.Model.modelName} findByIdAndUpdate`);
      return this.Model.findByIdAndUpdate(_id, data, options, (err, doc) => {
        console.timeEnd(`${this.Model.modelName} findByIdAndUpdate`);
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  findOneAndUpdate(query, data, options) {
    return new Promise((resolve, reject) => {
      console.log(
        chalk.green(`DBBaseProvider ${this.Model.modelName} findOneAndUpdate`),
      );
      console.log(query);
      console.log(data);
      console.log(options);
      console.time(`${this.Model.modelName} findOneAndUpdate`);
      return this.Model.findOneAndUpdate(query, data, options, (err, doc) => {
        console.timeEnd(`${this.Model.modelName} findOneAndUpdate`);
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  save(data) {
    return new Promise((resolve, reject) => {
      console.log(chalk.green(`DBBaseProvider ${this.Model.modelName} save`));
      console.time(`${this.Model.modelName} save`);
      return data.save((err, doc) => {
        console.timeEnd(`${this.Model.modelName} save`);
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
    });
  }

  update(query, data, options) {
    return new Promise((resolve, reject) => {
      console.log(chalk.green(`DBBaseProvider ${this.Model.modelName} update`));
      console.log(query);
      console.log(data);
      console.log(options);
      console.time(`${this.Model.modelName} update`);
      return this.Model.update(query, data, options, err => {
        console.timeEnd(`${this.Model.modelName} update`);
        if (err) {
          return reject(err);
        }
        return resolve('update ok');
      });
    });
  }

  remove(query, data, options) {
    return new Promise((resolve, reject) => {
      console.log(chalk.green(`DBBaseProvider ${this.Model.modelName} remove`));
      console.log(query);
      console.log(data);
      console.log(options);
      console.time(`${this.Model.modelName} remove`);
      return this.Model.remove(query, err => {
        console.timeEnd(`${this.Model.modelName} remove`);
        if (err) {
          return reject(err);
        }
        return resolve('remove ok');
      });
    });
  }
};
