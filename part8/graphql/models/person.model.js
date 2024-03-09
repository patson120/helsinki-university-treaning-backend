

const mongoose = require('mongoose')

const personModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    phone: {
        type: String,
        minlength: 5
    },
    street: {
        type: String,
        required: true,
        minlength: 5
    },
    city: {
        type: String,
        required: true,
        minlength: 3
    },
})

module.exports = mongoose.model('Person', personModel)