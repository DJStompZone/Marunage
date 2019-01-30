const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const configs = require('konfig')();

module.exports = class Mailer {
  constructor(params) {
    this.mailOpts = {
      from: configs.app.MAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    };

    const generator = xoauth2.createXOAuth2Generator({
      user: configs.app.MAIL_AUTH.user,
      clientId: configs.app.GOOGLE_AUTH.CLIENT_ID,
      clientSecret: configs.app.GOOGLE_AUTH.CLIENT_SECRET,
      refreshToken: configs.app.GOOGLE_AUTH.REFRESH_TOKEN,
      accessToken: configs.app.GOOGLE_AUTH.ACCESS_TOKEN,
    });

    generator.on('token', function(token) {
      console.log('New token for %s: %s', token.user, token.accessToken);
    });

    this.transporter = nodemailer.createTransport({
      service: configs.app.MAIL_SERVICE,
      auth: {
        xoauth2: generator,
      },
    });
  }

  send() {
    return new Promise((resolve, reject) => {
      return this.transporter.sendMail(this.mailOpts, (err, info) => {
        if (err) {
          console.log(err);
          this.transporter.close();
          return reject(err);
        }

        console.log('Message sent: ', info.response);
        this.transporter.close();
        return resolve(info);
      });
    });
  }
};
