/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const request = require('request');

const my = () => ({
  loadBase64Data(url) {
    return new Promise(function(resolve, reject) {
      return request(
        {
          url,
          encoding: null,
        },
        function(err, res, body) {
          if (!err && res.statusCode === 200) {
            const base64prefix = `data:${res.headers['content-type']};base64,`;
            const image = body.toString('base64');
            return resolve(base64prefix + image);
          } else {
            return reject(err);
          }
        },
      );
    });
  },

  saveImage(url, opts) {
    return new Promise(function(resolve, reject) {
      console.log(url, opts);
      const outputPath = `${opts.targetPath}/${opts.filename}`;
      const ws = fs.createWriteStream(`${opts.targetPath}/${opts.filename}`);
      request(url, opts.requestParams).pipe(ws);
      ws.on('finish', () => resolve(outputPath));
      return ws.on('error', function(err) {
        ws.end();
        return reject(err);
      });
    });
  },
});

exports.my = my();
