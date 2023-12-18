
const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (total, blog) => total + Number(blog.likes)

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let favorite = {
    title: "test 1",
    author: "John Doe",
    likes: 0
  }
  for (let blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  }
  return favorite;
}

const mostBlogs = (blogs) => {
  let found = []
  let author = { author: '', blogs: 0 }
  let favoriteAuthor = author
  for (let blog of blogs) {
    blogs = blogs.filter(b => {
      if (b.author === blog.author) {
        author = { author: b.author, blogs: author.blogs + 1 }
        return false
      }
      return true
    })
    if (author.blogs !== 0) {
      found = [...found, author]
      if (favoriteAuthor.blogs < author.blogs) favoriteAuthor = author
      author = { author: '', blogs: 0 }
    }
  }
  
  return favoriteAuthor
}

const mostLikes = (blogs) => {
  let found = []
  let author = { author: '', likes: 0 }
  let favoriteAuthor = author
  for (let blog of blogs) {
    blogs = blogs.filter(b => {
      if (b.author === blog.author) {
        author = { author: b.author, likes: author.likes + b.likes }
        return false
      }
      return true
    })
    if (author.likes !== 0) {
      found = [...found, author]
      if (favoriteAuthor.likes < author.likes) favoriteAuthor = author
      author = { author: '', likes: 0 }
    }
  }

  return favoriteAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes 
}