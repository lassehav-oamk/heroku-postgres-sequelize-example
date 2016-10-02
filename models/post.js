'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {            
    text: DataTypes.STRING    
  }, {
    classMethods: {
      associate: function(models) {

        // Each post is owned by a user
        Post.belongsTo(models.User);

        // Each post can have multiple likes and each like is from a user.
        // Join table with name UserPostLikes will be generated and it is accessed through generated methods,
        // which are based on the name Likes. So there will be for example getLikes etc.
        Post.belongsToMany(models.User, {through: 'UserPostLikes', as: 'Likes'});      
      }
    }
  });
  return Post;
};