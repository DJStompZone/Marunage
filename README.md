# Marunage

![](http://33.media.tumblr.com/57c11ea6ee179c37eed415a8e13bcf5a/tumblr_ngi5w6S2MR1qz64n4o1_500.gif)

### CORS SERVER for [Assist-waifu2x](https://github.com/eiurur/Assist-waifu2x)

# Usage

    # download source codes
    git clone git@github.com:eiurur/Marunage.git
    cd Marunage
    npm i

    # create keys
    cd keys
    openssl genrsa -out key.pem 1024
    openssl req -new -key key.pem -out certrequest.csr
    openssl x509 -req -in certrequest.csr -signkey key.pem -out cert.pem

    # launch
    npm start

Go to https://localhost:9966
