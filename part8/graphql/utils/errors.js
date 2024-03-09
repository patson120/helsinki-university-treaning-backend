const { GraphQLError } = require('graphql')

module.exports = {
    show: (message, code, args, error) => {
        throw new GraphQLError(message, {
            extensions: {
              code: code,
              invalidArgs: args.name, error
            }
          })
    }
}