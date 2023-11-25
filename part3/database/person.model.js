
const mongoose = require('mongoose')

const personModel = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        let liste = v.split('-')
        if (liste.length < 2 || liste.length > 2) {
          return false
        }
        else
          if (liste[0].length < 2 || liste[0].length > 3) {
            return false
          }
          else return true
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },

}, { timestamps: true })


personModel.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personModel)