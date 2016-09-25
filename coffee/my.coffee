fs   = require 'fs'
request   = require 'request'

my = ->

  loadBase64Data: (url) ->
    new Promise (resolve, reject) ->
      request
        url: url
        encoding: null
      , (err, res, body) ->
        if !err and res.statusCode is 200
          base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
          image = body.toString('base64')
          return resolve(base64prefix + image)
        else
          return reject err

  saveImage: (url, opts) ->
    new Promise (resolve, reject) ->
      console.log url, opts
      outputPath = "#{opts.targetPath}/#{opts.filename}"
      ws = fs.createWriteStream("#{opts.targetPath}/#{opts.filename}")
      request(url, opts.requestParams).pipe(ws)
      ws.on 'finish', -> return resolve outputPath
      ws.on 'error', (err) ->
        ws.end()
        return reject err

exports.my = my()