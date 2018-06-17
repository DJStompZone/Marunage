const path = require('path');
const configs = require('konfig')();
const Booru = require(path.resolve('js', 'lib', 'Booru'));
const GMailer = require(path.resolve('js', 'lib', 'GMailer'));
const HistoryProvider = require(path.resolve('js', 'model', 'HistoryProvider'));

/**
 *
 * @param {*} app
 */
module.exports = app => {
  app.post('/api/download/booru2x', async (req, res) => {
    console.log('Go convert!!', req.body);
    console.time('/api/download/booru2x');

    new HistoryProvider().upsert({ url: req.body.url });

    const resizeOptions = {
      url: req.body.url,
      denoise: req.body.noise - 0,
      scale: req.body.scale - 0,
      mime: req.body.mime,
    };
    const booru = new Booru({ resizeOptions });

    try {
      const { data, filename } = await booru.download();
      return res.json({
        data: data,
        filename: filename,
      });
    } catch (error) {
      console.error('error => ', error);
      console.error('error.statusCode => ', error.statusCode);
      return res.status(500).send({
        body: req.body,
        error: error,
      });
    }
  });
};
