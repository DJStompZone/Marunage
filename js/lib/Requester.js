const axios = require('axios');

module.exports = class Requester {
  constructor(options) {
    this.options = options === null ? {} : options;
    this.instance = this.getAxios();
    return;
  }

  getBaseURL() {
    return 'https://waifu2x.booru.pics';
  }

  getAxios() {
    return axios.create({
      baseURL: this.getBaseURL(),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      this.instance
        .get('/Home/fromlink', this.options)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  upload() {
    return new Promise((resolve, reject) => {
      this.instance
        .post('/Home/upload', this.options)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }
};
