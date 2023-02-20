const mongoose = require("mongoose")
const Leave = require("./leaveModel")

const EmployeeSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, 'Please add a fullname']
        },
        username: {
            type: String,
            required: [false, 'Please add a username value']
        },
        email: {
            type: String,
            required: [false, 'Please add a email value']
        },
        passwd: {
            type: String,
            required: [false, 'Please add a passwd value']
        },
        passwdConf: {
            type: String,
            required: [false, 'Please add a passwdConf value']
        },
        dob: {
            type: Date,
            required: [false, 'Please add a dob value']
        },
        gender: {
            type: String,
            required: [false, 'Please add a gender value']
        },
        city: {
            type: String,
            required: [false, 'Please add a city value']
        },
        noHp: {
            type: String,
            required: [false, 'Please add a noHp value']
        },
        dateJoin: {
            type: Date,
            required: [false, 'Please add a dateJoin value']
        },
        leaveBalance: {
            type: Number,
            required: [false, 'Please add a leaveBalance value']
        },
    },
    {
        timestamps: true
    }
)
EmployeeSchema.virtual('leaves', {
    ref: 'Leave',
    localField: '_id',
    foreignField: 'employeeID'
});

module.exports = mongoose.model('Employee', EmployeeSchema)