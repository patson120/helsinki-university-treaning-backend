

const mongoose = require('mongoose')
const supertest = require('supertest')
const models = require('../models');
const bcrypt = require('bcrypt')

const app = require('../app')
const { usersInDb } = require('./test_user_helper')
const api = supertest(app)


describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await models.User.deleteMany({});

        const passwordHash = await bcrypt.hash('pass123', 10)
        const user = new models.User(
            {
                username: 'root',
                name: 'root',
                passwordHash
            }
        )
        await user.save()
    }, 100000)

    test('Get all users ', async () => {
      const response = await api.get("/api/users")
      .expect(200).expect('Content-Type', /application\/json/)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})