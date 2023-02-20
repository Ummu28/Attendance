const asyncHandler = require("express-async-handler")

const Employee = require("../models/employeeModel")

// @desc   Get employees
// @route  GET /api/employees
// @access Private
const getEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find()

    res.status(200).json(employees)
})
// @desc   Set employees
// @route  POST /api/employees
// @access Private
const setEmployee = asyncHandler(async (req, res) => {

    if (!req.body.fullname) {
        res.status(400)

        throw new Error('Please add a fullname field')
    }

    const employee = await Employee.create({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        passwd: req.body.password,
        passwdConf: req.body.password2,
        dob: req.body.dob,
        gender: req.body.gender,
        city: req.body.city,
        noHp: req.body.noHp,
        dateJoin: req.body.dateJoin,
        leaveBalance: 20,
    })
    if (employee)
        res.status(200).json({ success: 1, details: employee })
    else
        res.status(400).json({ Error: "error" })
    // res.json(req.body.fullname)
})
// @desc   Find employee
// @route  GET /api/employees/find/:id
// @access Private
const findEmployee = asyncHandler(async (req, res) => {

    const employee = await Employee.findById(req.params.id)

    if (!employee) {
        res.status(400)

        throw new Error('Employee not found!')
    }

    res.status(200).json(employee)
})
// @desc   Update employees
// @route  PUT /api/employees/:id
// @access Private
const updateEmployee = asyncHandler(async (req, res) => {

    const employee = await Employee.findById(req.params.id)

    if (!employee) {
        res.status(400)

        throw new Error('Employee not found!')
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })

    // res.status(200).json(updatedEmployee)
    if (updatedEmployee) {
        res.status(200).json({ success: 1, updatedEmployee: updatedEmployee })
    } else {
        res.status(200).json({ fail: 1, message: "Fail to update" })
    }
})
// @desc   Delete employees
// @route  DELETE /api/employees/:id
// @access Private
const deleteEmployee = asyncHandler(async (req, res) => {

    const employee = await Employee.findById(req.params.id)

    if (!employee) {
        res.status(400)

        throw new Error('Employee not found!')
    }

    await employee.remove()

    res.status(200).json({ id: req.params.id, message: `${employee.fullname} has been deleted` })
})

module.exports = {
    getEmployees,
    findEmployee,
    setEmployee,
    updateEmployee,
    deleteEmployee
}