
const router = require('express').Router()
const personController = require('../controllers/personController')

router.route('/').get(personController.findAllPeople)
router.route('/:id').get(personController.findOnePerson)
router.route('/:id').delete(personController.findOneAndDelete)
router.route('/').post(personController.createOrUpdate)
router.route('/:id').put(personController.updateOne)

module.exports = router