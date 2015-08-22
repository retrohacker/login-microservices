'use strict';

var models = require('../models')
var stringify = require('json-stringify-safe')
var db = require('../../db')

module.exports = {
  get: get
}

function get(req, res) {
  if(!req.user) return res.status(401).end()
  var user = new models.User({'id':req.user})
  var sql = db.sql.fetchModels(models.User,user)
  db(sql.query,sql.arr,function(e,rows,result) {
    if(e || !rows[0] ) return res.status(500).end()
    res.status(200).json((new models.User(rows[0])).toJSON())
  })
}
