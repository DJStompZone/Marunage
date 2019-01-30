const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const axios = require('axios');
const download = require('download');
const FormData = require('form-data');
const Requester = require(path.resolve('js', 'lib', 'Requester'));
const ImageFile = require(path.resolve('js', 'lib', 'ImageFile'));

module.exports = class Booru {
  constructor(url, resizeOptions) {
    this.endpoint = 'https://waifu2x.booru.pics/';
    this.fileUploadUrl = `${this.endpoint}Home/upload`;
    this.url = url;
    this.resizeOptions = resizeOptions;
  }

  scrapeProduct(response) {
    console.log(response.data);
    const foundByExisting = response.data.match(
      '<a href="/outfiles/(.*).jpg" class="btn btn-default">',
    );
    const textBySplited = response.data.split(' ');

    let hash = null;

    // 生成済み
    if (foundByExisting !== null) {
      hash = foundByExisting[1];
    } else {
      // 生成中
      // ex) $.getJSON("\/Home\/statusjson?" + "handle=" + "H:waifu2x.slayerduck.com:913096"  + "&hash=" + "734c1a8558be03134c9c71f4692bb0f9c5f5914d_s2_n2", function(data) {
      const hashIndex = textBySplited.indexOf('"&hash="');
      if (hashIndex !== -1) {
        // "f9d405763a54c7925c135206545f5717b899c8bc_s2_n2", の形で抽出されるので余計な部分は取り除く
        hash = textBySplited[hashIndex + 2].replace(/"|,/g, '');
      }
    }
    console.log('\nhash ==> ', hash);
    if (hash === null || hash === '') {
      throw new Error('failed to resize in booru2x');
    }
    return hash;
  }

  async writeFileFrom(url, to) {
    const data = await download(url, { timeout: 1000 * 30 });
    const _ = await fsp.writeFile(to, data);
    return to;
  }

  async downloadWithFile() {
    const imageFile = new ImageFile(this.url);
    const tmp = path.resolve('tmp', 'images');
    const originalFilePath = path.resolve(tmp, imageFile.filename); // == to
    await this.writeFileFrom(this.url, originalFilePath);

    const form = new FormData();
    form.append('img', fs.createReadStream(originalFilePath), {
      filename: imageFile.filename,
    });
    Object.keys(this.resizeOptions).map(key => {
      form.append(key, this.resizeOptions[key]);
    });
    const response = await axios
      .create({
        headers: Object.assign(form.getHeaders(), {
          referer: 'https://waifu2x.booru.pics/',
          'Access-Control-Allow-Origin': '*',
        }),
      })
      .post(this.fileUploadUrl, form);

    const hash = this.scrapeProduct(response);
    const mime = `image/${this.resizeOptions.mime}`;
    const ext = this.resizeOptions.mime === 'png' ? '.png' : '.jpg';
    const dist = path.resolve('public', 'images');
    const filename = `${hash}${ext}`;
    const filepath = path.resolve(dist, filename);
    console.log('\ndownload ==> ', filename);
    const data = await download(
      `https://waifu2x.booru.pics/outfiles/${filename}`,
      { timeout: 1000 * 30 },
    );
    console.log('\nsave => ', filepath);
    const _ = await fsp.writeFile(filepath, data);
    console.log('Booru proceed', data, filename);
    return {
      data,
      filename,
    };
  }

  // TODO: 移行前のコード。あとで消す。
  async download() {
    const response = await new Requester({ params: this.resizeOptions }).get();

    const foundByExisting = response.data.match(
      '<a href="/outfiles/(.*).jpg" class="btn btn-default">',
    );
    const textBySplited = response.data.split(' ');

    let hash = null;

    // 生成済み
    if (foundByExisting !== null) {
      hash = foundByExisting[1];
    } else {
      // 生成中
      // ex) $.getJSON("\/Home\/statusjson?" + "handle=" + "H:waifu2x.slayerduck.com:913096"  + "&hash=" + "734c1a8558be03134c9c71f4692bb0f9c5f5914d_s2_n2", function(data) {
      const hashIndex = textBySplited.indexOf('"&hash="');
      if (hashIndex !== -1) {
        // "f9d405763a54c7925c135206545f5717b899c8bc_s2_n2", の形で抽出されるので余計な部分は取り除く
        hash = textBySplited[hashIndex + 2].replace(/"|,/g, '');
      }
    }

    console.log('\nhash ==> ', hash);

    if (hash === null || hash === '') {
      throw new Error('failed to resize in booru2x');
    }

    const mime = `image/${this.resizeOptions.mime}`;
    const ext = this.resizeOptions.mime === 'png' ? '.png' : '.jpg';
    const dist = path.resolve('public', 'images');
    const filename = `${hash}${ext}`;
    const filepath = path.resolve(dist, filename);
    console.log('\ndownload ==> ', filename);

    const data = await download(
      `https://waifu2x.booru.pics/outfiles/${filename}`,
      { timeout: 1000 * 30 },
    );

    console.log('\nsave => ', filepath);

    const _ = await fsp.writeFile(filepath, data);

    console.log('Booru proceed', data, filename);

    return {
      data,
      filename,
    };
  }

  format() {
    if (this.counts.length < 3) throw new Error('counts array is empty');
    return {
      date: dayjs().format('YYYY-MM-DD'),
      post: this.counts[0],
      doneOnce: this.counts[1],
      doneDup: this.counts[2],
    };
  }
};
