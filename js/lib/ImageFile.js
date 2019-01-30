const path = require('path');
const crypto = require('crypto');

module.exports = class ImageFile {
  constructor(url, name) {
    this.url = url;
    this.name = name || this.createHash(url);
    this.changeExtension(this.extractExtension(url));
  }

  createHash(key, algorithm) {
    algorithm = algorithm || 'sha256';
    return crypto
      .createHash(algorithm)
      .update(key)
      .digest('hex');
  }

  changeExtension(ext = '.jpg') {
    this.ext = ext;
    this.filename = `${this.name}${this.ext}`;
  }

  extractExtension(url) {
    return this.squeezeImageExtension(
      this.excludeIllegalCharactersFromExtension(this.getExtensionFromUrl(url)),
    );
  }

  // 画像拡張子に絞る
  squeezeImageExtension(ext) {
    return ['.jpg', '.png', '.jpeg', '.gif'].includes(ext) ? ext : '.jpg';
  }

  // クエリストリングなど、余計な文字を除去し、拡張子だけにする
  // <a href="http://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression" target="_blank">javascript - Removing all script tags from html with JS Regular Expression - Stack Overflow</a>
  excludeIllegalCharactersFromExtension(ext) {
    const regex = /[#\\?]/g; // regex of illegal extension characters
    const endOfExt = ext.search(regex);
    if (endOfExt <= -1) {
      return ext;
    }
    return ext.substring(0, endOfExt);
  }

  getExtensionFromUrl(url) {
    const filename = url.split('/').pop();
    return path.extname(filename);
  }
};
