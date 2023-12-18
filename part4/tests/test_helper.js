

const models = require('../models')

const initialBlogs = [
  {
    title: "Blog 1",
    author: "Helsinnki university",
    url: "https://www.amazon.com",
    likes: 4
  },
  {
    title: "Blog 2",
    author: "University of Washington",
    url: "https://www.amazon.com",
    likes: 2
  }
]

const nonExistingId = async () => {
  const blog = new models.Blog({ 
    title: 'willremovethissoon',
    author: 'John',
    url: 'http://',
    likes: 1,
})
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const notesInDb = async () => {
  const blogs = await models.Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, notesInDb
}