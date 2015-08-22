var controller = module.exports = {}
var winston = require('winston')
var models = require('../models')
var db = require('../db')

controller.createOrFetch =
function createOrFetch(provider,token,profile,cb) {
  createOrFetchOauth(provider,token,profile,function(e,oauth) {
    if(e) return cb(e)
    if(oauth.get("id")) return cb(null,oauth.get("id"))
    createOrFetchUser(oauth,function(e,user) {
      winston.debug(JSON.stringify(user))
      return oauthAddId(oauth,user.id,cb)
    })
  })
}

function oauthAddId(oauth,id,cb) {
  oauth.set("id",id)
  var sql = db.sql.updateModel(models.Oauth,oauth)
  db(sql.query,sql.arr,function(e,rows,result) {
    if(e) return cb(e)
    return cb(null,id)
  })
}

function createOrFetchOauth(provider,token,profile,cb) {
  if(provider === "google")
    return googleCreateOrFetch(token,profile,cb)
  else
    return cb(new Error("Provider does not exist."))
}

function createOrFetchUser(oauth,cb) {
  if(oauth.id)
    return fetchUser(oauth.get("id"),cb)
  else
    return createUser(oauth,cb)
}

function fetchUser(id,cb) {
  var sql = db.sql.fetchModels(models.User,new models.User({id:id}))
  db(sql.query,sql.arr,function(e,rows,result) {
    winsont.debug("Query result: "+rows)
    if(!rows || rows.length==0)
      return cb(e,null)
    return cb(e,user.set("id",rows[0].id))
  })
}

function createUser(oauth,cb) {
  if(oauth.get("provider") === "google")
    return createGoogleUser(oauth,cb)
  else
    return cb(new Error("Provider does not exist."))
}

function createGoogleUser(oauth,cb) {
  var obj = JSON.parse(oauth.get("json"))
  winston.debug("parsed google oauth json: ",obj)
  var user = new models.User()
  winston.debug(typeof obj)
  if(obj.emails && obj.emails[0] && obj.emails[0].value) {
    user.set("email",obj.emails[0].value)
  }
  if(obj.name && obj.name.familyName) {
    user.set("lastname",obj.name.familyName)
  }
  if(obj.name && obj.name.givenName) {
    user.set("firstname",obj.name.givenName)
  }
  insertUserIntoDB(user,cb)
}

function insertUserIntoDB(user,cb) {
  winston.verbose("Creating new user in database")
  winston.debug(JSON.stringify(user))
  var sql = db.sql.insertModelReturn(models.User,user,"id")
  db(sql.query,sql.arr,function(e,rows,result) {
    winston.debug(rows)
    if(rows) return cb(e,rows[0])
    return cb(e)
  })
}

function googleCreateOrFetch(token,profile,cb) {
  var oauth = new models.Oauth({
    'oauthid':profile.id,
    'provider':'google'
  })
  googleFetch(oauth,function(e,fetchedOauth) {
    if(e) return cb(e)
    if(fetchedOauth) {
      fetchedOauth = new models.Oauth(fetchedOauth)
      winston.debug(fetchedOauth)
      return cb(null,fetchedOauth)
    }
    oauth.set({
      access_token: token,
      json: JSON.stringify(profile)
    })
    googleCreate(oauth,function(e) {
      if(e) return cb(e)
      cb(null,oauth)
    })
  })
}

function googleFetch(obj,cb) {
  var sql = db.sql.fetchModels(models.Oauth,obj)
  db(sql.query,sql.arr,function(e,rows,result) {
    winston.debug("Query result: "+rows)
    if(!rows || rows.length==0)
      return cb(e,null)
    return cb(e,rows[0]) // they are unique so we can safely return the 1st
  })
}

function googleCreate(obj,cb) {
  winston.verbose("Creating new auth in database.")
  var sql = db.sql.insertModel(models.Oauth,obj)
  db(sql.query,sql.arr,function(e,rows,result) {
    return cb(e,null) // we already know the contents, we created it.
  })
}
