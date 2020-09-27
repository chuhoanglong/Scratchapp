var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    address: String,
    avatar: String,
    likes: Number,
    userName: String,
    userId: String
});

var User = mongoose.model('users', UserSchema, 'users');
module.exports = User;