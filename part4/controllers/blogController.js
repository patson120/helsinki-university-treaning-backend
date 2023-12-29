
const models = require('../models')
const logger = require('../utils/logger')

module.exports = {
    findAllBlogs: async (request, response, next) => {
        let blogs = await models.Blog.find({}).populate("user", { username: 1, name: 1 });
        return response.status(200).json(blogs);
    },
    findOneBlog: async (request, response, next) => {
        let blog = await models.Blog.findById(request.params.id)
        if (blog) {
            return response.status(200).json(blog)
        } else {
            response.status(404).end();
        }
    },

    findOneAndDelete: async (request, response, next) => {

        // get user from request object
        const user = request.user
        const blog = await models.Blog.findById(request.params.id)
        if (blog.user.toString() === user.id.toString()) {
            await models.Blog.findByIdAndRemove(blog.id)
            logger.info(blog.title)
            return response.status(204).end()
        }
        return response.status(403).json({ error: "User not authorized to delete this blog" })
    },

    createOrUpdate: async (request, response, next) => {
        const body = request.body

        // get user from request object
        const user = request.user
        // Crete a new blog
        const blog = new models.Blog({            
            title: body.title,
            author: body.author,
            url: body.url,
            likes: Number(body.likes),
            user: request.user.id.toString()
        })

        if (body.id){
            blog.id = `${body.id}`
        }

        let newBlog = await blog.save()
        user.blogs = user.blogs.concat(newBlog._id)
        await user.save()
        return response.status(201).json(newBlog);
    },

    updateOne: async (request, response, next) => {
        const { title, author, url, likes } = request.body
        let updatedBlog = await models.Blog.findByIdAndUpdate(
            request.params.id,
            { title, author, url, likes },
            { new: true, runValidators: true, context: 'query' }
        )
        return response.status(200).json(updatedBlog)
    },

    deleteOne: async (request, response, next) => {
        await models.Blog.findByIdAndRemove(request.params.id)
        return response.status(204).send();
    },
}
