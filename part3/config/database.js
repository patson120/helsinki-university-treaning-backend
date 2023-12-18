// Load environment variables
require('dotenv').config({ path: './.env' })
const mongoose = require('mongoose')
const logger = require('../utils/logger')
mongoose.set('strictQuery', true)
if (!process.env.MONGODB_URI) {
  logger.error('Please provide the URI of your Mongo database.')
  process.exit(1)
} else {
  mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => logger.info('Connected to MongoDB...'))
    .catch((error) => logger.error(error.message))
}
