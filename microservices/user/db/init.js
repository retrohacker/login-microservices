/**
 * This module will bootstrap the DB if it isn't already initialized
 */
var path = require('path')
var async = require('async')
var winston = require('winston')
var sql = require('./sql.js')

//A path to the models directory in the project and the model names
var modelsPath = path.join('../','models')
var models = ['user','oauth']


// We attempt to create DB entries for all models to ensure they exist at runtime
module.exports = function dbinit(db) {
  return function initDatabase(cb) {
  // Wait for database to come up
    async.during(establishConnection(db),waitingForConnection,function connectionEstablished(e) {
      if(e) {
        winston.error(e)
        return cb(e)
      }
      winston.info("Connected to postgres server!")
      attemptToCreateModels(db,function done(e) {
        if(e) winston.error(e)
        else winston.info("Finished initializing database!")
        cb(e)
      })
    })
  }
}

function establishConnection(db) {
  return function(cb) {
    winston.verbose("Attempting to connect to postgres server...")
    db('SELECT NOW()', function(e) {
      return cb(null,e)
    });
  }
}

function waitingForConnection(cb) {
  winston.verbose("Connection to postgres failed, retrying...")
  setTimeout(cb, 100);
}

function attemptToCreateModels(db,cb) {
  async.eachSeries(models,attemptToCreateModel(db),cb)
}

function attemptToCreateModel(db) {
  return function(model,cb) {
    winston.verbose("Attempting to create table "+model+"...")
    var model = require(path.join(modelsPath,model+'.js'))
    db(sql.createTableIfNotExists(model),cb)
  }
}
