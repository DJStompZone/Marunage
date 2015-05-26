request   = require 'request'

(->

  loadBase64Data =  (url) ->
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

  exports.myUtil =
    loadBase64Data: loadBase64Data

).call this