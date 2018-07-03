var mongoose = require('mongoose');  

var UserSchema = new mongoose.Schema({  
    username: String,
    email: String,
    password: String
});

mongoose.model('User', UserSchema, 'users');
module.exports = mongoose.model('User');