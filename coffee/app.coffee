_             　= require 'lodash'
http          　= require 'http'
fs            　= require 'fs'
path          　= require 'path'
util          　= require 'util'
cors          　= require 'cors'
morgan        　= require 'morgan'
express       　= require 'express'
bodyParser    　= require 'body-parser'
cookieParser  　= require 'cookie-parser'
methodOverride　= require 'method-override'
request       　= require 'superagent'
configs       　= require('konfig')()
{myUtil}      　= require './myUtil'
# dirname       　= path.resolve()
# imagesPath    　= dirname + '/images/'

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

###
API
###
app.post '/api/downloadFromURL', (req, res) ->
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
        return
      console.log 'res = ', response
      console.log '====='
      # fs.writeFile "#{imagesPath}#{Date.now()}.png", response.body, (err) ->
      #   console.log err
      res.json
        body: response.body
        type: response.type
    return
  return

# app.post '/api/download', (req, res) ->
#   console.log req.body
#   # console.log res
#   myUtil.loadBase64Data req.body.url
#   .then (base64Data) ->
#     console.log 'loda'
#     # decodedImage = new Buffer(base64Data, 'base64').toString('binary')
#     buff = new Buffer(base64Data.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64')
#     console.log typeof buff
#     fs.writeFile "#{imagesPath}image_decoded.png", buff, (err) ->
#       console.log err

#     console.log "#{imagesPath}image_decoded.png"
#     request
#       .post('http://waifu2x.udp.jp/api')
#       .type('form')
#       .set('Content-Type', 'multipart/form-data')
#       .field 'noise', req.body.noise
#       .field 'scale', req.body.scale
#       .attach 'file', "#{imagesPath}image_decoded.png", 'a.png'
#       # .send
#       #   file: "image_decoded.png"
#       #   noise: req.body.noise
#       #   scale: req.body.scale
#       .end (err, response) ->
#         if err
#           console.log 'err = ', err
#           return
#         console.log 'response = ', response
#         console.log '====='
#         res.json data: response
#         # res.json base64Data: res
#       return


http.createServer(app).listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get('port')
  return
