/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ImageManager;
const path = require('path');
const { my } = require(path.resolve('build', 'lib', 'my'));

const DEVIANTART_HOSTNAME = 'deviantart.com';
const GELBOORU_HOSTNAME = 'gelbooru.com';
const PIXIV_HOSTNAME = 'pixiv.net';
const SANKAKUCOMPLEX_HOSTNAME = 'sankakucomplex.com';

const IMAGES_TO = path.resolve('images');

module.exports = ImageManager = class ImageManager {
  constructor(url) {
    this.url = url;
    this.filename = url;
    this.hostname = url.hostname;
  }

  getRequestParams(hostname) {
    let result = {};
    if (hostname.indexOf(PIXIV_HOSTNAME) !== -1) {
      result = {
        headers: {
          referer: 'http://www.pixiv.net/',
        },
      };
    }
    if (hostname.indexOf(SANKAKUCOMPLEX_HOSTNAME) !== -1) {
      result = {
        headers: {
          'User-Agent': 'Magic Browser',
          referer: this.url,
        },
      };
    }
    return result;
  }

  // 8MB以上は拒否
  isOverLimitFilesize() {
    return new Promise((resolve, reject) => {
      const opts = { requestParams: this.getRequestParams(this.hostname) };
      return my.getFilesizeBite(this.url, opts).then(bite => {
        const mb = bite / (1024 * 1024);
        if (mb >= 8) {
          return reject('error');
        }
        return resolve(true);
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      const opts = {
        targetPath: IMAGES_TO,
        filename: this.url,
        requestParams: this.getRequestParams(this.hostname),
      };

      return my
        .saveImage(this.url, opts)
        .then(outputPath => resolve(outputPath))
        .catch(err => reject(err));
    });
  }
};
