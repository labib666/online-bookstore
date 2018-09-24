var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var UserSchema = new mongoose.Schema({  
    name: String,
    username: {
        type: String,
        unique: true,
        dropDups: true
    },
    email: {
        type: String,
        unique: true,
        dropDups: true
    },
    password: String,
    isModerator: Boolean
});

UserSchema.index({
    name: 'text',
    username: 'text',
    email: 'text'
});

UserSchema.plugin(timestamps);

module.exports = mongoose.model('User', UserSchema, 'users');