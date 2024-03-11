// Load environment variables
const config = require('../utils/config')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)


if (!config.MONGODB_URI) {
  console.log('Please provide the URI of your Mongo database.')
  process.exit(1)
} else {
  mongoose.connect(config.MONGODB_URI, {})
    .then(() => console.log('Connected to MongoDB...'))
    .catch((error) => console.log('error connection to MongoDB:', error.message))
}