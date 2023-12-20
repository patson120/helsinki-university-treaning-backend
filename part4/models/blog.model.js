
const mongoose = require('mongoose')

const blogModel = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    required: true,
  },
  author: {
    type: String,
    minLength: 4,
    required: true,
  },
  url: {
    type: String,
    minLength: 4,
    required: true,
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, { timestamps: true })

blogModel.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Blog', blogModel);