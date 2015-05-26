request   = require 'request'

(->
  twitter =
    get: (tweet, key, isRT) ->
      t = if isRT then tweet.retweeted_status else tweet
      switch key
        when 'description' then t.user.description
        when 'display_url' then t.entities?.media?[0].display_url
        when 'entities' then t.entities
        when 'expanded_url' then t.entities?.media?[0].expanded_url
        when 'followers_count' then t.user.followers_count
        when 'friends_count' then t.user.friends_count
        when 'hashtags'
          t.entities?.hashtags # TODO: 一個しか取れない
        when 'media_url'
          _.map t.extended_entities.media, (media) -> media.media_url
        when 'media_url_https'
          _.map t.extended_entities.media, (media) -> media.media_url_https
        when 'media_url:orig'
          _.map t.extended_entities.media, (media) -> media.media_url+':orig'
        when 'media_url_https:orig'
          _.map t.extended_entities.media, (media) -> media.media_url_https+':orig'
        when 'video_url'
          # videoは一件のみ
          t.extended_entities?.media[0]?.video_info?.variants[0].url
        when 'name' then t.user.name
        when 'profile_banner_url' then t.user.profile_banner_url
        when 'profile_image_url' then t.user.profile_image_url
        when 'statuses_count' then t.user.statuses_count
        when 'screen_name' then t.user.screen_name
        when 'source' then t.source
        when 'text' then t.text
        when 'timestamp_ms' then t.timestamp_ms
        when 'tweet.created_at' then t.created_at
        when 'tweet.favorite_count' then t.favorite_count
        when 'tweet.retweet_count' then t.retweet_count
        when 'tweet.id_str' then t.id_str
        when 'tweet.lang' then t.lang
        when 'user.created_at' then t.user.created_at
        when 'user.id_str' then t.user.id_str
        when 'user.favorite_count' then t.favorite_count
        when 'user.retweet_count' then t.retweet_count
        when 'user.lang' then t.user.lang
        when 'user.url' then t.user.url
        else null

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
    twitter: twitter
    loadBase64Data: loadBase64Data

).call this