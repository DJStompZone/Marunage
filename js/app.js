/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const util = require('util');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const configs = require('konfig')();
const { my } = require('./my');

const TIMEOUT_MS = 10 * 60 * 1000;

var app = (module.exports = (function() {
  app = express();
  app.set('port', process.env.PORT || configs.app.PORT);
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(methodOverride());
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.static(path.join(__dirname, '..', 'public')));
  return app;
})());

(function() {
  // routes, session

  require('./routes/api')(app);
  require('./routes/booru')(app);
  require('./routes/routes')(app);
})();

(function() {
  //server
  const hskey = fs.readFileSync(path.resolve('keys', 'key.pem'));
  const hscert = fs.readFileSync(path.resolve('keys', 'cert.pem'));
  const httpsOptions = {
    key: hskey,
    cert: hscert,
  };

  const server = https.createServer(httpsOptions, app);
  server.timeout = TIMEOUT_MS;
  server.listen(app.get('port'), function() {
    console.log(`Express server listening on port ${app.get('port')}`);
  });
})();
