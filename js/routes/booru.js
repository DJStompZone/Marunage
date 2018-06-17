const path = require('path');
const configs = require('konfig')();
const Booru = require(path.resolve('js', 'lib', 'Booru'));
const jobQueue = require(path.resolve('js', 'lib', 'JobQueueManager'));
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

      // error.
      if (error.statusCode === 404) {
        console.log('enquque ->\n\n');
        jobQueue.register({
          name: 'resize transporting',
          process: async job => await booru.download(),
          completed: (job, result) => {
            console.log('[resize] complete =>\n ', job.id, job.data, result);
            return res.json({
              data: result.data,
              filename: result.filename,
            });
          },
          failed: (job, result) => {
            console.log('[resize] error => \n ', job.id, job.data, result);
            return res.status(500).send({
              body: req.body,
              error: result,
            });
          },
        });
        jobQueue.add({
          name: 'resize transporting',
          opts: { backoff: 5000, attempts: 4 },
        });
      } else {
        console.log('\n\nもうあかんわ ->');
        // new Gmailer().send(error, req.body);
        res.status(500).send({
          body: req.body,
          error: error,
        });
      }
    }
  });
};
