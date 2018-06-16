/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const path = require('path');
const fs = require('fs');
const redis = require('redis');
const request = require('superagent');
const configs = require('konfig')();
const Mailer = require(path.resolve('js', 'Mailer'));
const { my } = require(path.resolve('js', 'my'));
const HistoryProvider = require(path.resolve('js', 'model', 'HistoryProvider'));

module.exports = function(app) {
  const getHistory = params =>
    new Promise(function(resolve, reject) {
      return new HistoryProvider()
        .find(params)
        .then(function(items) {
          console.log(items);
          return resolve(items);
        })
        .catch(err => reject(err));
    });

  const saveHistory = url =>
    new HistoryProvider()
      .upsert({ url })
      .then(result => console.log(result))
      .catch(err => console.log(err));

  const createHTMLForMail = (err, body, response) =>
    `\
<p>Assis-waifu2x Error</p>
<h1>ERR</h1>
<p>${err}</p>
<hr>
<h1>BODY</h1>
<p>${body.url}</p>
<hr>
<h1>Response</h1>
<p>${response.error}</p>
<p>${response.text}</p>\
`;

  const sendMail = function(err, body, response) {
    const params = {
      to: configs.app.MAIL_TO,
      subject: 'Assist-waifu2x Error',
      html: createHTMLForMail(err, body, response),
    };
    const mailer = new Mailer(params);
    return mailer
      .send()
      .then(result => res.json({ result, body, error: response.error }))
      .catch(err => res.json({ err }));
  };

  app.get('/api/history/list', function(req, res) {
    getHistory(req.query)
      .then(items => res.json({ history: items }))
      .catch(err => res.status(400).json({ message: err.message }));
  });

  return app.post('/api/download/waifu2x', function(req, res) {
    console.log('Go convert!!', req.body);
    console.time('/api/download/waifu2x');

    saveHistory(req.body.url);

    const sendOption = {
      url: req.body.url,
      noise: req.body.noise - 0,
      scale: req.body.scale - 0,
      style: req.body.style || 'art',
    };
    console.log(sendOption);

    request
      .post('http://waifu2x.udp.jp/api')
      .type('form')
      .send(sendOption)
      .end(function(err, response) {
        if (err) {
          console.log('err = ', err);
          sendMail(err, req.body, response);
          res.json({
            body: req.body,
            error: response.error,
          });
          return;
        }

        console.log('res = ', response);
        console.log('res.type = ', response.type);
        console.timeEnd('/api/download/waifu2x');

        return res.json({
          body: response.body,
          type: response.type,
        });
      });
  });
};
