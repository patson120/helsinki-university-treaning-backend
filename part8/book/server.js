// Load configuration to database
require('./config/database')

const config = require('./utils/config')

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const models = require('./models')

// Errors
const ERROR = require('./utils/errors')


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]


const typeDefs = `

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    findBook(title: String!): Book
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book!

    editAuthor(name: String, setBornTo: Int): Author
  }

`

const resolvers = {
  Query: {
    bookCount: async () => await models.Book.collection.countDocuments(),

    authorCount: async () => await models.Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let filteredBooks = await models.Book.find({}).populate("author")
      if (args.genre) {
        filteredBooks = filteredBooks.filter(book => book.genres.find(genre => genre === args.genre))
        // filteredBooks = await models.Book.find({ genres: { $in: [args.genre] } }).populate("author")   
      }
      if (!args.author) return filteredBooks
      return filteredBooks.filter(book => book.author === args.author)
    },

    findBook: async (root, args) => await models.Book.find({ name: args.title }),

    allAuthors: async () => {
      const authors = await models.Author.find({})
      const authorBooks = async (name) => (await models.Book.find({ author: name })).length
      return authors.map(async (author) => ({ ...author, bookCount: authorBooks(author.name) }))
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      let authorFound = await models.Author.findOne({ name: args.author })
      if (!authorFound) {
        authorFound = await models.Author.create({ name: args.author })
      }
      let book = await models.Book.findOne({ title: args.title })

      if (book) {
        ERROR.show("Name must be unique", "BAD_USER_INPUT", args.title, null)
      }
      
      return await models.Book.create({ ...args, author: authorFound })
    },

    editAuthor: async (root, args) => {
      let author = await models.Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      return await author.save()
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