var pg = module.exports = require('pg-query')
pg.pg = require('pg')
pg.init = require('./init.js')(pg)
pg.sql = require('./sql')
