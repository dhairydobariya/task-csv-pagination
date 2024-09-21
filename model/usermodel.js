const mongoose = require('mongoose');

let userschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

let usermodel = mongoose.model('users', userschema);

module.exports = usermodel;
