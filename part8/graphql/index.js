// Load configuration to database
require('./config/database')

// Configuration des variables d'environnement
const config = require('./utils/config');

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')


// Load models from mongoose database
const models = require("./models")

// Errors
const ERROR = require('./utils/errors')



const typeDefs = `
    enum YesNo {
        YES,
        NO
    }

    type Address {
        street: String!
        city: String! 
    }
  
    type Person {
        name: String!
        phone: String
        street: String!
        city: String!
        address: Address!
        id: ID!
    }

    type Mutation {

        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ) : Person

        editNumber(
            name: String!,
            phone: String!
        ): Person
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person!]!
        findPerson(name: String!): Person
    }
`

const resolvers = {

  Person: {
    address: ({ city, street }) => {
      return {
        city, street
      }
    }
  },

  Query: {
    personCount: async () => await models.Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return await models.Person.find({})
      return await models.Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => await models.Person.findOne({ name: args.name })
  },


  Mutation: {
    addPerson: async (root, args) => {

      const personFound = await models.Person.findOne({ name: args.name })
      if (personFound) {
        ERROR.show("Name must be unique", "BAD_USER_INPUT", args.name, null)
      }

      try {
        const person = new models.Person({ ...args })
        return await person.save()
      } catch (error) {
        ERROR.show("Saving person failed", "BAD_USER_INPUT", args.name, error)
      }
    },

    editNumber: async (root, args) => {
      const personFound = await models.Person.findOne({ name: args.name })
      if (!personFound) {
        ERROR.show("User not found", "BAD_USER_INPUT", args.name, null)
      }
      try {
        personFound.phone = args.phone
        return await personFound.save()
      } catch (error) {
        ERROR.show("Saving number failed", "BAD_USER_INPUT", args.name, null)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: config.PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})