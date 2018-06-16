const fs = require('fs');
const request = require('request');

const loadBase64Data = url => {
  return new Promise((resolve, reject) => {
    return request(
      {
        url,
        encoding: null,
      },
      (err, res, body) => {
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
};

const saveImage = (url, opts) => {
  return new Promise((resolve, reject) => {
    console.log(url, opts);
    const outputPath = `${opts.targetPath}/${opts.filename}`;
    const ws = fs.createWriteStream(`${opts.targetPath}/${opts.filename}`);
    request(url, opts.requestParams).pipe(ws);
    ws.on('finish', () => resolve(outputPath));
    return ws.on('error', err => {
      ws.end();
      return reject(err);
    });
  });
};

module.exports = {
  loadBase64Data,
  saveImage,
};
