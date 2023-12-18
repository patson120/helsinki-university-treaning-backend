
const express = require('express')
const cors = require('cors')

const app = express()

// Load configuration to database
require('./config/database')

const middlewares = require('./utils/middleware')


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')

app.use(morgan(middlewares.requestLogger))

module.exports = app