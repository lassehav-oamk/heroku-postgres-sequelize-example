'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var db        = {};

// Initialize sequelize with heroku postgres - the actuall address comes from the DATABASE_URL environment variable
var sequelize = new Sequelize(process.env.DATABASE_URL, { 
                                    dialect: 'postgres',
                                    protocol: 'postgres',
                                    dialectOptions: {
                                        ssl: true
                                    }
                                });

// Read through this folder and join the contents (the models) into the db object
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

// Execute the 'associate' method from each model if it exists
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// aliases
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;