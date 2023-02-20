const mongoose = require("mongoose")

const LocationSchema = mongoose.Schema(
    {
        latitude: {
            type: String,
            required: [false, 'Please add a attendanceDate value']
        },
        longitude: {
            type: String,
            required: [false, 'Please add a attendanceDate value']
        },
        radius: {
            type: Number,
            required: [false, 'Please add a attendanceDate value']
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Location', LocationSchema)