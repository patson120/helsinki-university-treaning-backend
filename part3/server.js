
// Load environment variables
require('dotenv').config({ path: './.env' })

// Load configuration to database
require('./config/database')

// Load middlewares
const middlewares = require('./middlewares')

const express = require('express')
const morgan = require('morgan')
const models = require('./database')

const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

const PORT = process.env.PORT || 3001

function generateId(max = 10000, min = 0) {
  return Math.floor(Math.random() * (max - min)) + min
}

// endpoint
app.get('/info', (request, response, next) => {
  let date = new Date()
  models.Person.find({}).then((people) => {
    response.status(200).send(`<h3>Phonebook has info for ${people.length} people</h3><p>${date.toUTCString()}</p>`)
  }).catch((error) => console.log('Enable to get collection', error.message))
})

app.get('/api/persons', (request, response) => {
  models.Person.find({}).then((people) => {
    response.status(200).json(people)
  }).catch((error) => {
    console.log('Enable to get collection', error)
    response.status(400).send(error.message)
  }
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  models.Person.findById(request.params.id).then(person => {
    if (person) {
      response.status(200).json(person)
    } else {
      next()
    }
  }).catch((err) => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  models.Person.findByIdAndDelete(request.params.id).then(person => {
    console.log(person)
    response.status(204).end()
  }).catch((err) => {
    next(err)
  })
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Missing name or number'
    })
  }

  const person = await models.Person.findOne({ name: body.name }).then(person => person)

  if (person) {
    // Update the existing person
    await models.Person.findByIdAndUpdate(person.id, { name: body.name, number: body.number }, { new: true }).then(personUpdate => {
      return response.status(201).json(personUpdate)
    }).catch(err => {
      next(err)
    })
  }
  else {
    // Crete a new person
    const contact = new models.Person({
      name: body.name,
      number: body.number,
    })

    contact.save().then((newPerson) => {
      return response.status(201).json(newPerson)
    }).catch((error) => {
      next(error)
    })
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  models.Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(middlewares.errorHandler)
app.use(middlewares.unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})