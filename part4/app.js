// Load configuration to database
require('./config/database')
require('express-async-errors')
const express = require('express')
const cors = require('cors')

const app = express()
const middlewares = require('./utils/middleware')


app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')


if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./routes/testingRouter')
  app.use('/api/testing', testingRouter)
}


app.use(morgan(middlewares.requestLogger))


// Blog controller
const blogRouter = require('./routes/blogRouter')

// user controller
const usersRouter = require('./routes/userRouter')

// login controller
const loginRouter = require('./routes/loginRouter')



// blog router
app.use('/api/blogs', middlewares.tokenExtractor, middlewares.userExtractor, blogRouter)

// blog router
app.use('/api/users', usersRouter)

// login router
app.use('/api/login', loginRouter)

// Error middleware
app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)


module.exports = app