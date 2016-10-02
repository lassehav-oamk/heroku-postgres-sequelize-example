# heroku-postgres-sequelize-example
Example how to run Sequelize with Heroku Postgres


##Sequelize Associations
(Detailed documentation http://docs.sequelizejs.com/en/latest/docs/associations/)

When calling a method such as User.hasOne(Project), we say that the User model (the model that the function is being invoked on) is the source and the Project model (the model being passed as an argument) is the target.

Let's have these defined for the entire association explanation list.
```
var Post = sequelize.define('Post', {});
var User = sequelize.define('User', {});
```
###One-to-one associations

####BelongsTo
Foreign key on the SOURCE model

```
Post.belongsTo(User);   // foreign key added to Post with the name userId
                        // Post will have .getUser and .setUser methods
```

####HasOne
Foreign key on the TARGET model
```
Post.hasOne(User); // foreign key added to User with the name postId
                   // Post will have the following methods Post.getUser and Post.setUser methods
```

###One-to-many associations
Source with multiple targets and targets have one source.
```
User.hasMany(Post); // foreign key added to post with name userId.
```
User will have the following methods
- .addPost, .addPosts
- .getPosts
- .createPost
- .countPosts
- .hasPost
- .hasPosts
- .removePost
- .removePosts
- .setPosts



###Many-to-many associations

####BelongsToMany
Used to connect sources with multiple targets and targets can have multiple sources.

Creates a new model with name UserPost for the join table, which will have userId and postId foreign keys.
The through definition is required.

```
User.belongsToMany(Post, {through: 'UserPost', as: 'Likes'});
Post.belongsToMany(User, {through: 'UserPost', as: 'Likes'}});
``` 
- Both User and Post will have the following methods 
- .getLikes 
- .setLikes 
- .addLike
- .addLikes
- .removeLikes
- .removeLikes
- .hasLikes
- .hasLike
- .createLike
- .countLikes











