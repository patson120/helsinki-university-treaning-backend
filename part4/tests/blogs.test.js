
const listHelper = require('../utils/list_helper')

describe('Blog post test', () => {
    const blogs = [
        {
            title: "Blog 1",
            author: "Patson1",
            url: "https://www.google.com",
            likes: 2,
            createdAt: "2023-11-25T14:37:55.416Z",
            updatedAt: "2023-11-25T14:37:55.416Z",
            id: "656206c3cf816d0932367a41"
        },
        {
            title: "Blog 2",
            author: "Patson2",
            url: "https://www.facebook.com",
            likes: 100,
            createdAt: "2023-11-25T14:38:20.407Z",
            updatedAt: "2023-11-25T14:38:20.407Z",
            id: "656206dccf816d0932367a43"
        },
        {
            title: "Blog 3",
            author: "Patson3",
            url: "https://www.amazon.com",
            likes: 4,
            createdAt: "2023-11-25T14:38:36.941Z",
            updatedAt: "2023-11-25T14:38:36.941Z",
            id: "656206eccf816d0932367a45"
        }
    ]
    test('Dummy returns one', () => {
        const result = listHelper.dummy([])
        expect(result).toBe(1)
    })

    test('Total likes', () => {
        const total = listHelper.totalLikes(blogs)
        expect(total).toBe(106)
    })

    test('Favorite blog', () => {
        
        const favorite = listHelper.favoriteBlog(blogs)
        
        expect(favorite).toEqual(blogs[1])
    })

    test('Most blogs', () => {
        let posts = [ ...blogs,  {
            title: "Blog 4",
            author: "Patson1",
            url: "https://www.google.com",
            likes: 5,
            createdAt: "2023-11-25T14:37:55.416Z",
            updatedAt: "2023-11-25T14:37:55.416Z",
            id: "656206c3cf816d0932367a41"
        },
        {
            title: "Blog 5",
            author: "Patson3",
            url: "https://www.google.com",
            likes: 5,
            createdAt: "2023-11-25T14:37:55.416Z",
            updatedAt: "2023-11-25T14:37:55.416Z",
            id: "656206c3cf816d0932367a41"
        }]
        const mostBlogs = listHelper.mostBlogs(posts)
        
        expect(mostBlogs.author).toBe('Patson1')
    })

    test('Most likes', () => {
        let posts = [ ...blogs,  {
            title: "Blog 4",
            author: "Patson1",
            url: "https://www.google.com",
            likes: 5,
            createdAt: "2023-11-25T14:37:55.416Z",
            updatedAt: "2023-11-25T14:37:55.416Z",
            id: "656206c3cf816d0932367a41"
        },
        {
            title: "Blog 5",
            author: "Patson3",
            url: "https://www.google.com",
            likes: 5,
            createdAt: "2023-11-25T14:37:55.416Z",
            updatedAt: "2023-11-25T14:37:55.416Z",
            id: "656206c3cf816d0932367a41"
        }]
        const mostBlogs = listHelper.mostLikes(posts)
        
        expect(mostBlogs.author).toBe('Patson2')
    })
})