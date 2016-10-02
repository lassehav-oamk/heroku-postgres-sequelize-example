'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING    
  }, {
    classMethods: {
      associate: function(models) {
        // User can have many posts, each post is directly linked to a user
        User.hasMany(models.Post);

        // Likes are implemented with many-to-many association, which will result in a join table called UserPostLikes
        // Generated methods will be accessed with the name Likes. For example getLikes()
        User.belongsToMany(models.Post, {through: 'UserPostLikes', as: 'Likes'});   
      }
    }
  });
  return User;
};