const asyncHandler = require("express-async-handler")

const axios = require("axios")

const Location = require("../models/locationModel")

// @desc   Get location
// @route  GET /api/location
// @access Private
const getLocation = asyncHandler(async (req, res) => {
    const location = await Location.findOne()

    if (location)
        res.status(200).json({ success: 1, location: location })
    else
        res.status(200).json({})
})

// @desc   Set location
// @route  POST /api/location
// @access Private
const setLocation = asyncHandler(async (req, res) => {

    const location = Location.find()

    if (!location) {
        const location2 = await Location.create({
            latitude: req.params.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius,
        })

        if (location2) {
            res.status(200).json({ success: 1, location: location2 })
        } else {
            res.status(200).json({ fail: 1 })
        }
    } else {

        const deleteLocation = await Location.remove()

        const location2 = await Location.create({
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            radius: req.body.radius,
        })

        if (location2) {
            res.status(200).json({ success: 1, location: location2 })
        } else {
            res.status(200).json({ fail: 1 })
        }

    }
})

module.exports = {
    getLocation, setLocation
}