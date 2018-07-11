var mongoose = require('mongoose');  
var timestamps = require('mongoose-timestamp');

var TokenSchema = new mongoose.Schema({  
    token: String,
    expiryTime: {
        type: Date,
        default: Date.now
    }
});

TokenSchema.plugin(timestamps);
TokenSchema.index({ expiryTime: 1 }, { expiresAfterSeconds: 3600 });

mongoose.model('Token', TokenSchema, 'tokens');
module.exports = mongoose.model('Token');