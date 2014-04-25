// Sequelize models loader. Loads all the models inside the /models folder.

var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , dbconfig  = require('../config/database.js')
  , sequelize = new Sequelize(dbconfig.mysqlDB,dbconfig.mysqlUsername,dbconfig.mysqlPassword )
  , db        = {}
 
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'user.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
 
Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})
 
module.exports = lodash.extend({
  sequelize: Sequelize,
  Sequelize: Sequelize
}, db)
