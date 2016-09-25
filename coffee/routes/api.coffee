
path            = require 'path'
fs              = require 'fs'
redis           = require 'redis'
request         = require 'superagent'
configs         = require('konfig')()
Mailer          = require path.resolve 'js', 'Mailer'
{my}            = require path.resolve 'js', 'my'
HistoryProvider = require path.resolve 'js', 'model', 'HistoryProvider'


module.exports = (app) ->

  getHistory = ->
    return new Promise (resolve, reject) ->
      new HistoryProvider().find()
      .then (items) ->
        console.log items
        return resolve items
      .catch (err) -> return reject err

  saveHistory = (url) ->
    new HistoryProvider().upsert(url: url)
    .then (result) -> console.log result
    .catch (err) -> console.log err

  createHTMLForMail = (err, body, response) ->
    """
    <p>Assis-waifu2x Error</p>
    <h1>ERR</h1>
    <p>#{err}</p>
    <hr>
    <h1>BODY</h1>
    <p>#{body.url}</p>
    <hr>
    <h1>Response</h1>
    <p>#{response.error}</p>
    <p>#{response.text}</p>
    """

  sendMail = (err, body, response) ->
    params =
      to: configs.app.MAIL_TO
      subject: 'Assist-waifu2x Error'
      html: createHTMLForMail(err, body, response)
    mailer = new Mailer(params)
    mailer.send()
    .then (result) -> res.json result: result, body: body, error: response.error
    .catch (err) -> res.json err: err


  app.get '/api/history/list', (req, res) ->
    getHistory().then (items) -> res.json history: items
    return

  app.post '/api/download/waifu2x', (req, res) ->
    console.log 'Go convert!!', req.body
    console.time "/api/download/waifu2x"

    saveHistory(req.body.url)

    sendOption =
      'url': req.body.url
      'noise': req.body.noise - 0
      'scale': req.body.scale - 0
      'style': req.body.style or 'art'
    console.log sendOption

    request
    .post('http://waifu2x.udp.jp/api')
    .type('form')
    .send sendOption
    .end (err, response) ->
      if err
        console.log 'err = ', err
        sendMail(err, req.body, response)
        res.json
          body: req.body
          error: response.error
        return

      console.log 'res = ', response
      console.log 'res.type = ', response.type
      console.timeEnd "/api/download/waifu2x"

      res.json
        body: response.body
        type: response.type
    return
