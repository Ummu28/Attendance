const mongoose = require("mongoose")

const LeaveSchema = mongoose.Schema(
    {
        employeeID: {
            type: mongoose.Schema.Types.ObjectID, ref: "Employee",
            // type: String,
            required: [true, 'Please provide Employee ID'],
        },
        leaveType: {
            type: String,
            required: [false, 'Please add a attendanceDate value']
        },
        beginDate: {
            type: Date,
            required: [false, 'Please add a clockIn value']
        },
        endDate: {
            type: Date,
            required: [false, 'Please add a clockOut value']
        },
        totalDays: {
            type: Number,
            required: [false, 'Please add a lateness value']
        },
        reason: {
            type: String,
            required: [false, 'Please add a overtime value']
        },
        attachedDocument: {
            type: String,
            required: [false, 'Please add a overtime value']
        },
        status: {
            type: String,
            required: [false, 'Please add a overtime value']
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Leave', LeaveSchema)