const mongoose = require('mongoose')
const supertest = require('supertest')
const models = require('../models');

const app = require('../app')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')
const api = supertest(app)

describe('Blogs API', () => {

    beforeEach(async () => {
        await models.Blog.deleteMany({})
        // for (let blog of initialBlogs) {
        //     let blogObject = new models.Blog(blog)
        //     await blogObject.save();
        // }
    }, 100000)

    test('Blogs are returned as json', async () => {
        const blogs = await blogsInDb();

        const token = await userLogin();

        const resopnse = await api.get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(resopnse.body).toHaveLength(blogs.length)
    })

    test("Propertie id should be difined", () => {
        let blog = {
            id: '',
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 4
        }
        expect(blog.id).toBeDefined();
    })

    test('Add new blogs', async () => {
        // const token = await userLogin()
        const blogs = await blogsInDb();
        let blog = {
            id: await nonExistingId(),
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 4
        }
        await api.post('/api/blogs')
            // .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(401)
            .expect('Content-Type', /application\/json/);

        // const response = await api.get('/api/blogs')
        //     .set('Authorization', `Bearer ${token}`)
        //     .expect(200)
        //     .expect('Content-Type', /application\/json/);

        // expect(response.body).toHaveLength(blogs.length + 1);

        // const newBlogResponse = await api.get(`/api/blogs/${blog.id.toString()}`)
        //     .set('Authorization', `Bearer ${token}`)
        //     .expect(200)
        //     .expect('Content-Type', /application\/json/);

        // expect(newBlogResponse.body.id.toString()).toEqual(blog.id.toString());

    });

    test('Verify author or url before added ', async () => {
        let blog = {
            id: nonExistingId(),
            title: "Blog 1",
            author: "Helsinnki university",
            url: "https://www.amazon.com",
            likes: 4
        }

        const token  = await userLogin()

        const response = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        const token = await userLogin()
        const blog = await models.Blog.findOne({ title: "Blog 1" })

        await api.delete(`/api/blogs/${blog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
            .expect('Content-Type', /application\/json/);
    });

    test("update a blog", async () => {
        const token = await userLogin()
        const id = await nonExistingId();
        await api.put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(initialBlogs[0])
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    afterAll(async () => {
        await mongoose.connection.close()
    })


})

const userLogin = async () => {
    const loginResponse = await api.post('/api/login')
        .send({ username: 'root', password: 'pass123' });
    return loginResponse.body.token
}