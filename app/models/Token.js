var mongoose = require('mongoose');  
var timestamps = require('mongoose-timestamp');

var TokenSchema = new mongoose.Schema({  
    token: String
});

TokenSchema.plugin(timestamps);
TokenSchema.index({ createdAt: 1 }, { expiresAfterSeconds: 3600 });

mongoose.model('Token', TokenSchema, 'tokens');
module.exports = mongoose.model('Token');