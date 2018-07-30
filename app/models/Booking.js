var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var BookingSchema = new mongoose.Schema({  
    user_id: String,
    book_id: String,
    quantity: Number,
    status: String
});

BookingSchema.plugin(timestamps);

mongoose.model('Booking', BookingSchema, 'bookings');
module.exports = mongoose.model('Booking');