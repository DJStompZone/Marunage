const fsp = require('fs').promises;
const path = require('path');
const download = require('download');
const configs = require('konfig')();
const Booru = require(path.resolve('js', 'lib', 'Booru'));
const Requester = require(path.resolve('js', 'lib', 'Requester'));
const GMailer = require(path.resolve('js', 'lib', 'GMailer'));
const { loadBase64Data } = require(path.resolve('js', 'my'));
const HistoryProvider = require(path.resolve('js', 'model', 'HistoryProvider'));

module.exports = app => {
  app.post('/api/download/waifu2x', function(req, res) {
    console.log('Go convert!!', req.body);
    console.time('/api/download/waifu2x');

    new HistoryProvider().upsert({ url: req.body.url });

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
          new GMailer().send(err, req.body, response);
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
