
const jwt = require('jsonwebtoken')

const config = require('./config')
const models = require('../models')

module.exports = async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(
            auth.substring(7), config.JWT_SECRET
        )
        const currentUser = await models.User.findById(decodedToken.id).populate('friends')
        return { currentUser }
    }
}