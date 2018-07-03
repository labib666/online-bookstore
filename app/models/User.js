var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var UserSchema = new mongoose.Schema({  
    username: String,
    email: String,
    password: String
});

UserSchema.plugin(timestamps);

mongoose.model('User', UserSchema, 'users');
module.exports = mongoose.model('User');