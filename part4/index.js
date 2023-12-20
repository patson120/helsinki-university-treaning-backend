

// Load environment variables
const config = require('./utils/config')
// Load Logger
const logger = require('./utils/logger')
// Load middlewares
const middlewares = require('./utils/middleware')
const app = require('./app')


// Server listening
app.listen(config.PORT, () => logger.error(`Server running on port => ${config.PORT}`))
