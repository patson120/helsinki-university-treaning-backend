
const router = require('express').Router()
const blogController = require('../controllers/blogController')

router.route('/').get(blogController.findAllBlogs)
router.route('/:id').get(blogController.findOneBlog)
router.route('/:id').delete(blogController.findOneAndDelete)
router.route('/').post(blogController.createOrUpdate)
router.route('/:id').put(blogController.updateOne)
router.route('/:id/comments').post(blogController.addComment)

module.exports = router