
const router = require('express').Router()
const userController = require('../controllers/userController')


router.route('/').get(userController.findAllUsers)
router.route('/').post(userController.addUser)
router.route('/:id').get(userController.findOneUser)
router.route('/:id').delete(userController.findOneAndDelete)
router.route('/all').delete(userController.deleteAllUsers)

module.exports = router