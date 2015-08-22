var sql = module.exports = {}
var winston = require('winston')
winston.level = "debug"

sql.createTableIfNotExists =
function createTableIfNotExists(model) {
  // IF NOT EXISTS to prevent bad things
  var result = 'CREATE TABLE IF NOT EXISTS '+model.tableName+' ('
  Object.keys(model.types).forEach(function(v) {
    result += '"'+v+'" ' // Add the var name
    result += model.types[v] + ',' // Add var type
  })
  if(model.unique) {
    result += " UNIQUE ("
    model.unique.forEach(function(u) {
      result += u + ","
    })
    result = result.slice(0,-1) // remove trailing comma
    result += "),"
  }
  if(model.primary) {
    result += " primary key ("
    model.primary.forEach(function(p) {
      result += p + ","
    })
    result = result.slice(0,-1) // remove trailing comma
    result += "),"
  }
  result = result.slice(0,-1) // remove trailing comma
  result += ')'
  winston.debug(result)
  return result
}

sql.fetchModels =
function fetchModels(model,obj) {
  var query = 'SELECT * FROM '+model.tableName+' WHERE '
  var arr = []
  var modelKeys = Object.keys(model.types)
  var index = 1
  winston.debug(obj.toJSON())
  Object.keys(obj.toJSON()).forEach(function(key) {
    if(modelKeys.indexOf(key) === -1) return null
    query += ""+key+"="
    query += "$"+(index++)+" AND " // Add the value
    arr.push(obj.get(key))
  })
  query = query.slice(0,-5)
  result = {
    query: query,
    arr: arr
  }
  winston.debug(result)
  return result
}

sql.insertModel =
function insertModel(model,obj) {
  var query = 'INSERT INTO '+model.tableName+' ('
  var arr = []
  var modelKeys = Object.keys(model.types)
  var index = 1
  winston.debug(obj.toJSON())
  Object.keys(obj.toJSON()).forEach(function(key) {
    if(modelKeys.indexOf(key) === -1) return null
    query += ""+key+","
    arr.push(obj.get(key))
  })
  query = query.slice(0,-1)
  query += ') VALUES ('
  Object.keys(arr).forEach(function(key) {
    query += "$"+(index++)+"," // Add the value
  })
  query = query.slice(0,-1)
  query += ')'
  result =  {
    query: query,
    arr: arr
  }
  winston.debug(result)
  return result
}

/* Inserts a model into the DB and returns `returning` values*/
sql.insertModelReturn =
function insertModelReturn(model,obj,returning) {
  var query = 'INSERT INTO '+model.tableName+' ('
  var arr = []
  var modelKeys = Object.keys(model.types)
  var index = 1
  winston.debug(obj.toJSON())
  Object.keys(obj.toJSON()).forEach(function(key) {
    if(modelKeys.indexOf(key) === -1) return null
    query += ""+key+","
    arr.push(obj.get(key))
  })
  query = query.slice(0,-1)
  query += ') VALUES ('
  Object.keys(arr).forEach(function(key) {
    query += "$"+(index++)+"," // Add the value
  })
  query = query.slice(0,-1)
  query += ') RETURNING ' + returning
  result =  {
    query: query,
    arr: arr
  }
  winston.debug(result)
  return result
}

sql.updateModel =
function updateModel(model,obj) {
  var query = 'UPDATE '+model.tableName+' SET '
  var arr = []
  var modelKeys = Object.keys(model.types)
  var index = 1
  winston.debug(obj.toJSON())
  Object.keys(obj.toJSON()).forEach(function(key) {
    if( modelKeys.indexOf(key) === -1 ||
        model.primary.indexOf(key) !== -1)
        return null
    query += ""+key+" = " +"$"+(index++)+","
    arr.push(obj.get(key))
  })
  query = query.slice(0,-1)
  query += ' WHERE '
  Object.keys(obj.toJSON()).forEach(function(key) {
    if(model.primary.indexOf(key) === -1) return null
    query += ""+key+" = " +"$"+(index++)+" AND "
    arr.push(obj.get(key))
  })
  query = query.slice(0,-5)
  result =  {
    query: query,
    arr: arr
  }
  winston.debug(result)
  return result
}
