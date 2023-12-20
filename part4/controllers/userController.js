

const models = require('../models')

const logger = require('../utils/logger')

const bcrypt = require('bcrypt')

module.exports = {

    findAllUsers: async (request, response, next) => {
        const users = await models.User.find({}).populate('blogs', { url: 1, title: 1, author: 1});
        return response.json(users)
    },

    addUser: async (request, response, next) => {

        const { username, name, password } = request.body


        if (!username || !name) {
            return response.status(400).json({
                error: 'Missing name or username'
            });
        }

        if (!password || password.length < 3) {
            return response.status(400).json({
                error: 'Password must be at least 3 characters',
            });
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new models.User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    },

    findOneUser: async (request, response, next) => {
        let user = await models.User.findById(request.params.id)
        if (user) {
            return response.status(200).json(user)
        } else {
            response.status(404).end();
        }
    },
    findOneAndDelete: async (request, response, next) => {
        let user = await models.User.findByIdAndDelete(request.params.id)
        logger.info(user.username)
        return response.status(204).end()
    },

    deleteAllUsers: async (request, response, next) => {
        await models.User.deleteMany({})
        return response.status(204).end()
    }
}