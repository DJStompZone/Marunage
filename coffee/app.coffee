fs            　= require 'fs'
http          　= require 'http'
https         　= require 'https'
path          　= require 'path'
util          　= require 'util'
cors          　= require 'cors'
morgan        　= require 'morgan'
express       　= require 'express'
bodyParser    　= require 'body-parser'
cookieParser  　= require 'cookie-parser'
methodOverride　= require 'method-override'
configs       　= require('konfig')()
{my}          　= require './my'

TIMEOUT_MS      = 10 * 60 * 1000

app = module.exports = do ->

  app = express()
  app.set 'port', process.env.PORT or configs.app.PORT
  app.use cookieParser()
  app.use bodyParser.json(limit: '50mb')
  app.use bodyParser.urlencoded(extended: true, limit: '50mb')
  app.use methodOverride()
  app.use morgan('dev')
  app.use cors()
  app.use express.static(path.join(__dirname, '..', 'public'))
  return app

do -> # routes, session

  (require './routes/api')(app)
  (require './routes/routes')(app)

do -> #server
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
