const asyncHandler = require("express-async-handler")

const Employee = require("../models/employeeModel")
const Attendance = require("../models/attendanceModel")

// @desc   Get attendances
// @route  GET /api/attendances
// @access Private
const getAttendances = asyncHandler(async (req, res) => {
    const attendances = await Attendance.find()

    res.status(200).json(attendances)
})
// @desc   POST attendances of specific employee
// @route  POST /api/attendances/employee/:id
// @access Private
const getAttendancesByEmployee = asyncHandler(async (req, res) => {

    const attendances = await Attendance.find({ employeeID: req.params.id, "attendanceDate": { $regex: `^${req.body.thismonth}` } })

    if (!attendances) {
        res.status(400)

        throw new Error("No attendance for this employee")
    } else {
        res.status(200).json({ success: 1, attendances: attendances })
    }
})
// @desc   POST attendances of specific employee
// @route  GET /api/attendances/all/employee/:id
// @access Private
const getAllAttendancesByEmployee = asyncHandler(async (req, res) => {

    const attendances = await Attendance.find({ employeeID: req.params.id })

    if (!attendances) {
        res.status(400)
        throw new Error("No attendance for this employee")
    } else {
        res.status(200).json({ success: 1, attendances: attendances })
    }
})
// @desc   Set attendance
// @route  POST /api/attendances
// @access Private
const setAttendance = asyncHandler(async (req, res) => {

    const employee = await Employee.findById(req.params.id)

    if (!employee) {
        res.status(400)

        throw new Error('employee not found')
    }

    const attendance = await Attendance.create({
        employeeID: employee._id,
        attendanceDate: req.body.attendanceDate,
        clockIn: req.body.clockIn,
        clockOut: req.body.clockOut,
        lateness: req.body.lateness,
        overtime: req.body.overtime,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    })
    if (attendance)
        res.status(200).json({ success: 1, details: attendance })
    else
        res.status(400).json({ Error: "error" })
    // res.json(employee._id)
})
// @desc   Find attendance
// @route  GET /api/attendances/find/:id
// @access Private
const findAttendance = asyncHandler(async (req, res) => {

    const attendance = await Attendance.findOne({ employeeID: req.params.id, attendanceDate: req.body.date });

    if (!attendance) {
        res.status(400)

        throw new Error('Attendance not found!')
    }
    else {
        // console.log(req.body.date);
        res.status(200).json({ success: 1, attendance: attendance })
    }


})
// @desc   Find attendance
// @route  GET /api/attendances/findbyid/:id
// @access Private
const getAttendanceById = asyncHandler(async (req, res) => {

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
        res.status(400)

        throw new Error('Attendance not found!')
    }
    else {
        // console.log(req.body.date);
        res.status(200).json({ success: 1, attendance: attendance })
    }
})
// @desc   Update attendance
// @route  PUT /api/attendances/:id
// @access Private
const updateAttendance = asyncHandler(async (req, res) => {

    const attendance = await Attendance.findById(req.params.id)

    if (!attendance) {
        res.status(400)

        throw new Error('Attendance not found!')
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (updatedAttendance) {
        res.status(200).json({ success: 1, updatedAttendance: updatedAttendance })
    } else {
        res.status(200).json({ fail: 1, message: "Fail to update" })
    }
})

module.exports = {
    getAttendances,
    findAttendance,
    setAttendance,
    updateAttendance,
    getAttendancesByEmployee,
    getAttendanceById,
    getAllAttendancesByEmployee
}