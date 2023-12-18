const mongoose = require('mongoose')
const supertest = require('supertest')
const models = require('../models');

const app = require('../app')
const { initialBlogs, nonExistingId } = require('./test_helper')
const api = supertest(app)

describe('Blogs API', () => {

    beforeEach(async () => {
        await models.Blog.deleteMany({})

        for (let blog of initialBlogs) {
            let blogObject = new models.Blog(blog)
            await blogObject.save();
        }
    })

    test('Blogs are returned as json', async () => {
        const resopnse = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(resopnse.body).toHaveLength(initialBlogs.length);
    });

    test("Propertie id should be difined", () => {
        let blog = {
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 4
        }
        expect(blog.id).toBeDefined();
    })

    test('Add new blogs', async () => {
        let blog = {
            id: nonExistingId(),
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 4
        }
        await api.post('/api/blogs')
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveLength(initialBlogs.length + 1);

        const newBlog = await api.get(`/api/blogs/${blog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(newBlog).toEqual(blog);

    });

    test('Verify author or url before added ', async () => {
        let blog = {
            id: nonExistingId(),
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 4
        }

        const response = await api.post('/api/blogs')
            .send(blog)
            .expect('Content-Type', /application\/json/);

        if (!expect(blog.title) || !expect(blog.url)) {
            expect(400)
        }
    })

    test("Verify likes propertie", async () => {
        let blog = {
            id: "foo",
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 0
        }

        if (!expect(blog.likes).toBeDefined()) {
            blog.likes = 0;
        }
    });

    test("Delete a blog", async () => {
        const id = await nonExistingId();
        await api.delete(`/api/blogs/${id}`)
            .expect(204)
            .expect('Content-Type', /application\/json/);
    });

    test("update a blog", async () => {
        const id = await nonExistingId();
        await api.put(`/api/blogs/${id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    afterAll(async () => {
        await mongoose.connection.close()
    })

})

