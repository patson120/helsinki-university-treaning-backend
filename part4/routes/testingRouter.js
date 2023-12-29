
const router = require('express').Router()
const testingController = require('../controllers/testingController')

router.route('/reset').post(testingController.reset)

module.exports = router