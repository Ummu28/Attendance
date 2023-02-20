const mongoose = require("mongoose")

const AttendanceSchema = mongoose.Schema(
    {
        employeeID: {
            type: mongoose.Schema.Types.ObjectID, ref: "Employee",
            // type: String,
            required: [true, 'Please provide Employee ID']
        },
        attendanceDate: {
            type: String,
            required: [false, 'Please add a attendanceDate value']
        },
        clockIn: {
            type: Date,
            required: [false, 'Please add a clockIn value']
        },
        clockOut: {
            type: Date,
            required: [false, 'Please add a clockOut value']
        },
        lateness: {
            type: Number,
            required: [false, 'Please add a lateness value']
        },
        overtime: {
            type: Number,
            required: [false, 'Please add a overtime value']
        },
        latitude: {
            type: Number,
            required: [false, 'Please add a overtime value']
        },
        longitude: {
            type: Number,
            required: [false, 'Please add a overtime value']
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Attendance', AttendanceSchema)