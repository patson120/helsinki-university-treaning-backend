// Load environment variables
const config = require('./utils/config')
// Load Logger
const logger = require('./utils/logger')
// Load middlewares
const middlewares = require('./utils/middleware')
const models = require('./models')
const app = require('./app')

const personRouter = require('./routes/personRouter')

// endpoint
app.get('/info', (request, response, next) => {
  let date = new Date()
  models.Person.find({}).then((people) => {
    response.status(200).send(`<h3>Phonebook has info for ${people.length} people</h3><p>${date.toUTCString()}</p>`)
  }).catch((error) => logger.error('Enable to get collection', error.message))
})

// Person router
app.use('/api/persons', personRouter)

// Error middleware
app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

// Server listening
app.listen(config.PORT, () => logger.error(`Server running on port => ${config.PORT}`))
