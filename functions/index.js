const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPosts, pushOnePost } = require('./handlers/posts');
const { register, login } = require('./handlers/users');

// Posts Routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, pushOnePost);

// Users routes
app.post('/register', register);
app.post('/login', login);

exports.api = functions.region('asia-east2').https.onRequest(app);
