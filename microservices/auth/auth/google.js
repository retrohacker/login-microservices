var express = require('express')
var session = require('../session')
var passport = require('passport')
var PassportGoogleOauth = require('passport-google-oauth').OAuth2Strategy
var winston = require('winston')
var creds = require('./creds.json')
var controller = require('../controller')

var router = module.exports = express.Router()
router.use(session)

var realm = process.env.APP_HOST+process.env.APP_ROUTE
var redirect = process.env.APP_REDIRECT

winston.info("Server will listen on: "+realm)
winston.info("Server will redirect to: "+redirect)


passport.serializeUser(function(user,done) {
  winston.debug("Saving ",user," as session data")
  done(null,user)
})

passport.deserializeUser(function(user,done) {
  winston.debug("Fetching ",user," from session data")
  done(null,user)
})

passport.use(new PassportGoogleOauth({
    clientID: creds.google.id,
    clientSecret: creds.google.secret,
    callbackURL: realm+"/google/return",
  },
  function(accessToken, refreshToken, profile, done) {
    winston.verbose("authenticated: ",accessToken)
    winston.debug(profile)
    controller.createOrFetch("google",accessToken,profile,function(e,auth) {
      if(e) winston.error(e)
      else {
        winston.debug(auth)
        winston.verbose("synced with database: ",accessToken)
      }
      done(e,auth)
    })
  }
))

router.use(passport.initialize())
router.use(passport.session())

router.get( '/',
            passport.authenticate('google',{
              scope: 'openid email'
            })
)

router.get( '/return',
            passport.authenticate('google', {
              successRedirect: redirect+'?login=success',
              failureRedirect: redirect+'?login=fail'
            })
)
