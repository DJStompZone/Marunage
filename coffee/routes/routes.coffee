path = require 'path'

module.exports = (app) ->

  app.get '/', (req, res) ->
    res.sendFile path.resolve 'public', 'index.html'
    return

  app.get '/history', (req, res) ->
    res.sendFile path.resolve 'public', 'history.html'
    return
