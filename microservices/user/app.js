'use strict';
var winston = require('winston')
winston.level = "debug"
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var path = require('path')
var session = require('./session')
var passport = require('passport')
module.exports = app; // for testing

var config = {
  swaggerFile: 'swagger.yaml',
  appRoot: __dirname,
};

passport.serializeUser(function(user,done) {
  winston.debug("Saving ",user," as session data")
  done(null,user)
})

passport.deserializeUser(function(user,done) {
  winston.debug("Fetching ",user," from session data")
  done(null,user)
})

app.use(session)
app.use(passport.initialize())
app.use(passport.session())

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  app.listen(process.env.APP_PORT||3000,function() {
  });
});
