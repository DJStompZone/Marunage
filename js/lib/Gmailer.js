const Mailer = require('./Mailer');

/**
 * TODO: GmailではなくSlackに投げる。
 */
module.exports = class GMailer {
  constructor({ res }) {
    this.res = res;
    return this;
  }

  createHTMLForMail(err, body, response) {
    `\
<p>Assis-waifu2x Error</p>
<h1>ERR</h1>
<p>${err}</p>
<hr>
<h1>BODY</h1>
<p>${body.url}</p>
<hr>
<h1>Response</h1>
<p>${response.error}</p>
<p>${response.text}</p>\
`;
  }

  send(err, body, response) {
    const params = {
      to: configs.app.MAIL_TO,
      subject: 'Assist-waifu2x Error',
      html: this.createHTMLForMail(err, body, response),
    };
    const mailer = new Mailer(params);
    return mailer
      .send()
      .then(result => res.json({ result, body, error: response.error }))
      .catch(err => res.json({ err }));
  }
};
