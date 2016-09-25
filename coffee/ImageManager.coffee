path               = require 'path'
{my}               = require path.resolve 'build', 'lib', 'my'

DEVIANTART_HOSTNAME     = 'deviantart.com'
GELBOORU_HOSTNAME       = 'gelbooru.com'
PIXIV_HOSTNAME          = 'pixiv.net'
SANKAKUCOMPLEX_HOSTNAME = 'sankakucomplex.com'

IMAGES_TO      = path.resolve 'images'

module.exports = class ImageManager
  constructor: (url) ->
    @url      = url
    @filename = url
    @hostname = url.hostname

  getRequestParams: (hostname) ->
    result = {}
    unless hostname.indexOf(PIXIV_HOSTNAME) is -1
      result =
        headers:
          'referer': 'http://www.pixiv.net/'
    unless hostname.indexOf(SANKAKUCOMPLEX_HOSTNAME) is -1
      result =
        headers:
          'User-Agent': 'Magic Browser'
          'referer': @url
    return result

  # 8MB以上は拒否
  isOverLimitFilesize: ->
    return new Promise (resolve, reject) =>
      opts =
        requestParams: @getRequestParams @hostname
      my.getFilesizeBite(@url, opts)
      .then (bite) =>
        mb = bite / (1024 * 1024)
        if mb >= 8 then return reject 'error'
        return resolve true

  save: ->
    return new Promise (resolve, reject) =>
      opts =
        targetPath: IMAGES_TO
        filename: @url
        requestParams: @getRequestParams @hostname

      my.saveImage @url, opts
      .then (outputPath) -> return resolve outputPath
      .catch (err) -> return reject err