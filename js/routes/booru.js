const fsp = require('fs').promises;
const path = require('path');
const download = require('download');
const configs = require('konfig')();
const Booru = require(path.resolve('js', 'lib', 'Booru'));
const Requester = require(path.resolve('js', 'lib', 'Requester'));
const GMailer = require(path.resolve('js', 'lib', 'GMailer'));
const HistoryProvider = require(path.resolve('js', 'model', 'HistoryProvider'));

/**
 * TOOD: 個々の処理をクラス化
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

    try {
      const response = await new Requester({ params: resizeOptions }).get();
      console.log(response.status);
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

      if (hash === null || hash === '') {
        throw new Error('failed to resize in booru2x');
      }

      const ext = '.png'; // TODO: 選択式
      const mine = ext === '.png' ? 'image/png' : 'image/jpeg';
      const dist = path.resolve('public', 'images');
      const filename = `${hash}${ext}`;
      const filepath = path.resolve(dist, filename);
      const data = await download(
        `https://waifu2x.booru.pics/outfiles/${filename}`,
        { timeout: 1000 * 120 },
      );
      const _ = await fsp.writeFile(filepath, data);

      return res.json({
        data: data,
        filename: filename,
      });
    } catch (error) {
      console.error('error => ', error);
      console.error('error.data => ', error.data);
      // new Gmailer().send(error, req.body);
      res.status(404).send({
        body: req.body,
        error: error,
      });
    }
  });
};
