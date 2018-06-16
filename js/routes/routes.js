/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const path = require('path');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.sendFile(path.resolve('public', 'index.html'));
  });

  app.get('/history', function(req, res) {
    res.sendFile(path.resolve('public', 'history.html'));
  });
};
