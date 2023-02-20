const express = require("express")
const router = express.Router()

const { getLocation, setLocation } = require("../controllers/locationController")

router.route('/').get(getLocation).post(setLocation)

module.exports = router