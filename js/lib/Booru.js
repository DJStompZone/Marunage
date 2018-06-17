const fsp = require('fs').promises;
const path = require('path');
const download = require('download');
const Requester = require(path.resolve('js', 'lib', 'Requester'));

module.exports = class Booru {
  constructor({ resizeOptions }) {
    this.endpoint = 'https://waifu2x.booru.pics/';
    this.resizeOptions = resizeOptions;
  }

  async download() {
    const response = await new Requester({ params: this.resizeOptions }).get();
    console.log(response.status);
    // console.log(response.data);

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
