

const models = require('../models')

module.exports = {
    reset: async (request, response, next) => {
        await models.Blog.deleteMany({})
        await models.User.deleteMany({})
        return response.status(204).end()
    }
}