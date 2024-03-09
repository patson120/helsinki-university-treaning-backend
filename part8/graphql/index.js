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

const jwt = require('jsonwebtoken')

// Build context methode
const buildContext = require('./utils/build.context')



const typeDefs = `
    enum YesNo {
        YES,
        NO
    }

    type Address {
        street: String!
        city: String! 
    }

    type User {
      username: String!
      friends: [Person!]!
      id: ID!
    }
    
    type Token {
      value: String!
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

        createUser(
            username: String!
        ): User

        login(
            username: String!
            password: String!
        ): Token

        addAsFriend(
            name: String!
        ): User
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person!]!
        findPerson(name: String!): Person
        me: User
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
        allPersons: async (root, args, context) => {
            if (!args.phone) return await models.Person.find({})
            return await models.Person.find({ phone: { $exists: args.phone === 'YES' } })
        },
        findPerson: async (root, args) => await models.Person.findOne({ name: args.name }),

        me: (root, args, context) => {
            return context.currentUser
        }
    },


    Mutation: {
        addPerson: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                ERROR.show("Not authenticated", "BAD_USER_INPUT", args.name, null)
            }

            const personFound = await models.Person.findOne({ name: args.name })
            if (personFound) {
                ERROR.show("Name must be unique", "BAD_USER_INPUT", args.name, null)
            }

            try {
                let person = new models.Person({ ...args })
                person = await person.save()
                currentUser.friends = currentUser.friends.concat(person)
                await currentUser.save()
                return person
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
        },

        createUser: async (root, args) => {
            const user = new models.User({ username: args.username })

            return user.save()
                .catch(error => {
                    ERROR.show("Creating the user failed", "BAD_USER_INPUT", args.username, error)
                })
        },
        login: async (root, args) => {
            const user = await models.User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                ERROR.show("Wrong credentials", "BAD_USER_INPUT", args.username, null)
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, config.JWT_SECRET) }
        },

        addAsFriend: async (root, args, { currentUser }) => {
            const isFriend = (person) =>
                currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

            if (!currentUser) {
                ERROR.show("Wrong credentials", "BAD_USER_INPUT", null, null)
            }

            const person = await models.Person.findOne({ name: args.name })
            if (!isFriend(person)) {
                currentUser.friends = currentUser.friends.concat(person)
            }

            return await currentUser.save()
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})


startStandaloneServer(server, {
    listen: { port: config.PORT },
    context: buildContext,
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})