
const models = require('../models')

const logger = require('../utils/logger')

module.exports = {

    findAllBlogs: async (request, response) => {
        let blogs = await models.Blog.find({})
        return response.status(200).json(blogs)

    },

    findOneBlog: async (request, response, next) => {
        let blog = await models.Blog.findById(request.params.id)
        if (blog) {
            return response.status(200).json(blog)
        } else {
            next()
        }
    },

    findOneAndDelete: (request, response, next) => {
        let blog = models.Blog.findByIdAndDelete(request.params.id)
        logger.info(blog.title)
        return response.status(204).end()

    },

    createOrUpdate: async (request, response, next) => {
        const body = request.body

        // Crete a new blog
        const blog = new models.Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: Number(body.likes),
        })

        let newBlog = await blog.save()
        return response.status(201).json(newBlog)

    },

    updateOne: (request, response, next) => {
        const { title, author, url, likes } = request.body
        let updatedBlog = models.Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true, runValidators: true, context: 'query' }
        )
        return response.json(updatedBlog)
    }
}