fs            　= require 'fs'
http          　= require 'http'
https          　= require 'https'
path          　= require 'path'
util          　= require 'util'
cors          　= require 'cors'
morgan        　= require 'morgan'
express       　= require 'express'
request       　= require 'superagent'
bodyParser    　= require 'body-parser'
cookieParser  　= require 'cookie-parser'
methodOverride　= require 'method-override'
configs       　= require('konfig')()
{myUtil}      　= require './myUtil'
# dirname       　= path.resolve()
# imagesPath    　= dirname + '/images/'


hskey   = fs.readFileSync path.resolve 'keys', 'renge-key.pem'
hscert  = fs.readFileSync path.resolve 'keys', 'renge-cert.pem'

httpsOptions =
  key: hskey
  cert: hscert

app = express()
app.set 'port', process.env.PORT or configs.app.PORT
app.use cookieParser()
app.use bodyParser.json(limit: '50mb')
app.use bodyParser.urlencoded(extended: true, limit: '50mb')
app.use methodOverride()
app.use morgan('dev')
app.use cors()

app.get '/', (req, res) ->
  res.end 'innn'
  return

app.post '/api/downloadFromURL', (req, res) ->
  console.log 'Go convert!!', req.body
  # id = setInterval( ->
  #   console.log '!!!'
  #   res.setHeader('content-type', 'application/json')
  # , 3000)
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
        res.json
          body: req.body
          error: response.error
        return
      console.log 'res = ', response
      # fs.writeFile "#{imagesPath}#{Date.now()}.png", response.body, (err) ->
      #   console.log err
      res.json
        body: response.body
        type: response.type
      # clearInterval(id)
    return
  return

https.createServer(httpsOptions, app).listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get('port')
  return
