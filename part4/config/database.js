// Load environment variables
const config = require('../utils/config')
const mongoose = require('mongoose')
const logger = require('../utils/logger')
mongoose.set('strictQuery', true)
if (!config.MONGODB_URI) {
  logger.error('Please provide the URI of your Mongo database.')
  process.exit(1)
} else {
  mongoose.connect(config.MONGODB_URI, {})
    .then(() => logger.info('Connected to MongoDB...'))
    .catch((error) => logger.error(error.message))
}
