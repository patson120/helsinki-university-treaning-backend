

// Load environment variables
const config = require('./utils/config')
// Load Logger
const logger = require('./utils/logger')
// Load middlewares
const middlewares = require('./utils/middleware')
const app = require('./app')

const blogRouter = require('./routes/blogRouter')

// Person router
app.use('/api/blogs', blogRouter)

// Error middleware
app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

// Server listening
app.listen(config.PORT, () => logger.error(`Server running on port => ${config.PORT}`))
