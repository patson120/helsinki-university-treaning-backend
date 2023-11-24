
// Load environment variables
require('dotenv').config({ path: "./.env" });

// Load configuration to database
require("./config/database")

const express = require('express');
const morgan = require('morgan');
const models = require('./database');

const cors = require("cors")
const app = express();

app.use(cors())
app.use(express.json());

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}));


const PORT = process.env.PORT || 3001;

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]



function generateId(max = 10000, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}


// endpoint

app.get('/info', (request, response) => {
    let date = new Date();
    models.Person.find({}).then((people) => {
        response.status(200).send(`<h3>Phonebook has info for ${people.length} people</h3><p>${date.toUTCString()}</p>`)
    }).catch((error) => console.log("Enable to get collection"));
});

app.get('/api/persons', (request, response) => {
    models.Person.find({}).then((people) => {
        response.status(200).json(people);
    }).catch((error) => {
        console.log("Enable to get collection ", error)
        response.status(400).json(error);
    }
    );
});

app.get('/api/persons/:id', (request, response) => {
    models.Person.findById(request.params.id).then(person => {
        if (person) {
            response.status(200).json(person)
        } else {
            response.status(404).end()
        }
    }).catch((err) => {
        response.status(404).json(err)
    });
});

app.delete('/api/persons/:id', (request, response) => {
    models.Person.findByIdAndDelete(request.params.id).then(person => {
        console.log("Deleted", person);
        response.status(204).end();
    }).catch((err) => {
        response.status(404).json(err)
    });
});

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Missing name or number'
        });
    }
    const person = new models.Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((newPerson) => {
        response.status(201).json(newPerson);
    }).catch((error) => {
        console.log("Error", error.message);
        response.status(400).json(error);
    });

    
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});