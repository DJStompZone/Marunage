(->
  _          = require('lodash')
  {myUtil}   = require './myUtil'
  exception  = require './exception'
  {settings} = if process.env.NODE_ENV == 'production' then require("./configs/production") else require("./configs/development")

  ###
  # Twitter -> Tumblr
  ###
  t2t =

    checkIllegalTweet: (tweet) ->
      rt_exclude_pattern = /(RT)/g
      twitter_short_url_pattern = /^[\s\S]*(http:\/\/t.co\/[\w]+)/

      isRT = _.has tweet, 'retweeted_status'

      if isRT then throw new exception.doneRetweetException

      if !_.has tweet, 'text' then throw new exception.NoTextTweetException

      if !_.has tweet.entities, 'urls' then throw new exception.TextOnlyTweetException

      if !_.isEmpty tweet.entities.urls then throw new exception.UrlException

      linkUrl = tweet.text.match(twitter_short_url_pattern)
      if _.isNull(linkUrl) then throw new (exception.TextOnlyTweetException)

      isUnofficialRT = rt_exclude_pattern.test myUtil.twitter.get(tweet, 'text', isRT)
      if isUnofficialRT then throw new exception.isUnofficialRTException
      return

    splitTags: (tweet) ->
      hasHash = (text) -> text.indexOf('#') is 0
      tweet.text.split(' ').filter(hasHash)

    replaceAll: (text, beforeWord, afterWord) ->
      return text.split(beforeWord).join(afterWord)

    getMediaUrl: (tweet) ->
      tweet.entities.media[0].media_url + ':orig'

    getPicUrl: (tweet) ->
      tweet.entities.media[0].display_url

    post: (tweet) ->
      tags = @replaceAll(tweet.text, ' ', ',')
      caption = @getPicUrl(tweet)
      source = @getMediaUrl(tweet)

      settings.tumblr.post '/post',
        type: 'photo'
        tags: tags
        caption: caption
        source: source
      , (err, json) ->
        if err then console.log err
        console.log json

  exports.t2t = t2t

).call this