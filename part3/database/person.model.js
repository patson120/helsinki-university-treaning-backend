
const mongoose = require('mongoose');

const personModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },

}, { timestamps: true });


personModel.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personModel);