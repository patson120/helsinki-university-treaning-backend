
const models = require('../models')

module.exports = {

    findAllPeople: (request, response) => {
        models.Person.find({}).then((people) => {
            response.status(200).json(people)
        }).catch((error) => {
            console.log('Enable to get collection', error)
            response.status(400).send(error.message)
        }
        )
    },

    findOnePerson: (request, response, next) => {
        models.Person.findById(request.params.id).then(person => {
            if (person) {
                response.status(200).json(person)
            } else {
                next()
            }
        }).catch((err) => next(err))
    },

    findOneAndDelete: (request, response, next) => {
        models.Person.findByIdAndDelete(request.params.id).then(person => {
            console.log(person)
            response.status(204).end()
        }).catch((err) => {
            next(err)
        })
    },

    createOrUpdate: async (request, response, next) => {
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
    },

    updateOne: (request, response, next) => {
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
    },

    generateId: (max = 10000, min = 0) => {
        return Math.floor(Math.random() * (max - min)) + min
    }
}




