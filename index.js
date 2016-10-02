var Promise = require("bluebird");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var models = require('./models');
var app = express();

// Activate CORS policy
app.use(cors());

// You can store key-value pairs in express, here we store the port setting
app.set('port', (process.env.PORT || 80));

// bodyParser needs to be configured for parsing JSON from HTTP body
app.use(bodyParser.json());

// Simple hello world route for testing
app.get('/', function(req, res, next) {
    res.send("Hello world");
});

// Query all posts and include the owner user data with the result
app.get('/posts', function(req, res, next){    
    models.Post.findAll({include: [models.User]}).then(function(queryResults) {
        res.json(queryResults);
    }); 
});

// Get a single post based on its id number
app.get('/posts/:id', function(req, res, next){    
    models.Post.findById(req.params.id).then(function(post) {
        res.json(post);
    }).catch(function(err){
        res.sendStatus(404); // not found
    }); 
});

// Create a new user with the following JSON body structure in the HTTP request
// {
//      "username": "value"   
// }
app.post('/users', function(req,res,next){
    models.User.create({
        username: req.body.username        
    }).then(function(i) {
        res.json(i);        
    });
});

// Get all users
app.get('/users', function(req,res,next){
    models.User.findAll().then(function(u){
        res.json(u);
    })
});

// create new post with the following JSON body structure in the HTTP request
// {
//      "text": "post content"   
// }
app.post('/users/:userId/post', function(req,res,next){
    models.User.findById(req.params.userId).then(function(u){
        u.createPost({   
            caption: req.body.text 
        })        
        .then(function(newPost) { 
            newPost.dataValues.User = u;   // Add full user information to the outgoing response. Otherwise only user id will be present.
            res.json(newPost);                                
        });       
    });    
});

// Add a like to a post from a user
app.post('/posts/:postId/likes/:userId', function(req,res,next){
    // To add a like to a post from user, we need to find instances of both of them.
    // Bluebird promise library is being used and from there the .all method
    // see details from http://bluebirdjs.com/docs/api/promise.all.html
    Promise.all([
        models.User.findById(req.params.userId),
        models.Post.findById(req.params.postId)
    ]).then(function(results) { // results of both operations are in the same order they were started

        var user = results[0]; // Not really necessary, just creating new referencing variables for easier understanding
        var post = results[1]; // Not really necessary, just creating new referencing variables for easier understanding

        // Add the user to like this post
        post.addLike(user).then(function(likeRes){
            res.json(likeRes); // respond with the result of the addLike operation
        })
        .catch(function(err){
            console.log(err);
            res.sendStatus(500); // in the case of errors we will send status code 500
        });
        
    })
});

// Get the count of likes in a single post
app.get('/posts/:postId/likes/count',function(req,res,next){

    // First find the correct post
    models.Post.findById(req.params.postId).then(function(post){
        // get the count of likes in the post
        post.countLikes().then(function(likes){
            res.json(likes);
        });        
    });    
});


// Initialize sequelize and drop the database before reconstructing it (the force: true)
models.sequelize.sync({force: true}).then(function() {
    // Start the express server listening once the sequelize sync operation has completed
    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });
});
