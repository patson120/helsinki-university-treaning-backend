

const models = require('../models')

const initialUsers = [
  {
    username: "root",
    name: "root",
    passwordHash: "pass123",
  }
]

const nonExistingId = async () => {
  const user = new models.User({ 
    username: 'root',
    name: 'John',
    passwordHash: 'pass123',
})
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await models.User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers, nonExistingId, usersInDb
}