const express = require("express")
const router = express.Router()

const { getLeaves, setLeave, findLeave, updateLeave } = require("../controllers/leaveController")

router.route('/').get(getLeaves)

router.route('/find/:id').get(findLeave)

router.route('/:id').post(setLeave).put(updateLeave)

module.exports = router