

require('dotenv').config({ path: './.env' })

const PORT = process.env.PORT || 4000

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET

module.exports = { PORT, MONGODB_URI, JWT_SECRET }