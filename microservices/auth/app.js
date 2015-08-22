var winston = require('winston')
winston.level = "debug"

var express = require('express')
var auth = require('./auth')
var db = require('./db')

var app = express()
app.use(process.env.APP_ROUTE,auth)


// Setup database and then start the server
db.init(function() {
  var server = app.listen(process.env.APP_PORT,function() {
    winston.info("Server listening on ",server.address().port)
  })
})
