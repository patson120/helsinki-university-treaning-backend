
const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const authorModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
})

authorModel.plugin(uniqueValidator)

module.exports = mongoose.model('Author', authorModel)