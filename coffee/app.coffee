fs            　= require 'fs'
http          　= require 'http'
https         　= require 'https'
path          　= require 'path'
util          　= require 'util'
cors          　= require 'cors'
morgan        　= require 'morgan'
redis         　= require 'redis'
express       　= require 'express'
request       　= require 'superagent'
bodyParser    　= require 'body-parser'
cookieParser  　= require 'cookie-parser'
methodOverride　= require 'method-override'
configs       　= require('konfig')()
{myUtil}      　= require './myUtil'
Mailer         = require path.resolve 'js', 'Mailer'

TIMEOUT_MS          = 10 * 60 * 1000
REDIS_DATABASE_NAME = 'ASSIST-WAIFU2X'
REDIS_HISTORY       = "#{REDIS_DATABASE_NAME}:history"

redisClient = redis.createClient()

app = express()
app.set 'port', process.env.PORT or configs.app.PORT
app.use cookieParser()
app.use bodyParser.json(limit: '50mb')
app.use bodyParser.urlencoded(extended: true, limit: '50mb')
app.use methodOverride()
app.use morgan('dev')
app.use cors()
app.use express.static(path.join(__dirname, '..', 'public'))

app.get '/', (req, res) ->
  res.sendFile path.resolve 'public', 'index.html'
  return

app.get '/history', (req, res) ->
  res.sendFile path.resolve 'public', 'history.html'
  return

app.get '/api/history/list', (req, res) ->
  getHistory().then (items) -> res.json history: items
  return

getHistory = ->
  return new Promise (resolve, reject) ->
    redisClient.lrange REDIS_HISTORY, 0, -1,  (err, items) ->
      if err then console.error err
      return resolve items

saveHistory = (value) ->
  redisClient.rpush REDIS_HISTORY, value
  getHistory().then (items) -> console.log items

app.post '/api/download/waifu2x', (req, res) ->
  console.log 'Go convert!!', req.body
  console.time "/api/download/waifu2x"
  saveHistory(req.body.url)

  request
    .post('http://waifu2x.udp.jp/api')
    .type('form')
    .send
      'url': req.body.url
      'noise': req.body.noise - 0
      'scale': req.body.scale - 0
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
  return

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


hskey        = fs.readFileSync path.resolve 'keys', 'renge-key.pem'
hscert       = fs.readFileSync path.resolve 'keys', 'renge-cert.pem'
httpsOptions =
  key: hskey
  cert: hscert

server = https.createServer(httpsOptions, app)
server.timeout = TIMEOUT_MS
server.listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get('port')
  return
