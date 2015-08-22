var session = require('express-session');
var RedisStore = require('connect-redis')(session)
var redis = require('redis')
var winston = require('winston')

var client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_URL)

client.auth(process.env.REDIS_AUTH,function() {
  winston.info("Connected to Redis")
})
client.on('error',function(e) {
  winston.error("Redis Error: "+e)
})

module.exports = session({
  secret: process.env.REDIS_SECRET,
  store: new RedisStore({'client':client})
})
