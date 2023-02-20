const asyncHandler = require("express-async-handler")

const axios = require("axios")

const Leave = require("../models/leaveModel")
const Employee = require("../models/employeeModel")

const fs = require('fs').promises;

// @desc   Get leaves
// @route  GET /api/leaves
// @access Private
const getLeaves = asyncHandler(async (req, res) => {
    const leaves = await Leave.find().sort({ "status": -1 })

    res.status(200).json(leaves)
    // const leaves = await Employee.find().populate('leaves').exec();

    // leaves.forEach(element => {

    // });

    // res.status(200).json(leaves)
})
// @desc   Set leave
// @route  POST /api/leaves/:id
// @access Private
const setLeave = asyncHandler(async (req, res) => {

    const employee = Employee.findById(req.params.id)

    console.log(req.params.id);

    if (!employee) {
        res.status(400)

        throw new Error('Please Employee Not Found')
    } else {

        const newpath = "uploads/";

        const file = req.files?.file[0];

        // console.log(req.body.employeeID);
        console.log(req.body);

        if (file == null || file == undefined || file == "" || file == " " || file == "undefined") {
            const leave = await Leave.create({
                employeeID: req.params.id,
                beginDate: req.body.beginDate,
                endDate: req.body.endDate,
                totalDays: req.body.totalDays,
                reason: req.body.reason,
                leaveType: req.body.leaveType,
                status: "PENDING"
            })
            if (leave)
                res.status(200).json({ success: 1, details: leave })
            else
                res.status(400).json({ Error: "Error! Please contact admin" })
        } else {
            var filename = file.name;
            var filename = `${req.body.employeeID}_${req.body.currentDate}_${filename}`;

            file.mv(`${newpath}${filename}`, async (err) => {
                if (err) {
                    res.status(500).send({ message: "File upload failed", code: 200 });
                } else {
                    const leave = await Leave.create({
                        employeeID: req.params.id,
                        beginDate: req.body.beginDate,
                        endDate: req.body.endDate,
                        totalDays: req.body.totalDays,
                        reason: req.body.reason,
                        leaveType: req.body.leaveType,
                        attachedDocument: filename,
                        status: "PENDING"
                    })
                    if (leave)
                        res.status(200).json({ success: 1, details: leave })
                    else
                        res.status(400).json({ Error: "Error! Please contact admin" })
                }
            });
        }
    }

    // const employee = await Employee.create({
    //     fullname: req.body.fullname,
    //     username: req.body.username,
    //     email: req.body.email,
    //     passwd: req.body.password,
    //     passwdConf: req.body.password2,
    //     dob: req.body.dob,
    //     gender: req.body.gender,
    //     city: req.body.city,
    //     noHp: req.body.noHp,
    //     dateJoin: req.body.dateJoin,
    //     leaveBalance: 20,
    // })
    // if (employee)
    //     res.status(200).json({ success: 1, details: employee })
    // else
    //     res.status(400).json({ Error: "error" })
    // res.json(req.body.fullname)
})
// @desc   Find employee
// @route  GET /api/leaves/find/:id
// @access Private
const findLeave = asyncHandler(async (req, res) => {

    const employee = await Employee.findById(req.params.id)

    if (!employee) {
        res.status(400).json({ message: "Employee Not Found" })

        throw new Error('Employee not found!')
    } {
        const leaves = await Leave.find({ employeeID: req.params.id })

        if (!leaves) {
            res.status(200).json({})
        } else {
            res.status(200).json(leaves)
        }
    }
})
// @desc   Update leave
// @route  PUT /api/leaves/:id
// @access Private
const updateLeave = asyncHandler(async (req, res) => {

    const leave = await Leave.findById(req.params.id)

    if (!leave) {
        res.status(400)

        throw new Error('Leave record not found!')
    } else {

        const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true })

        const employee = await Employee.findById(updatedLeave.employeeID)

        if (updatedLeave) {
            try {
                axios.put(`http://localhost:5010/api/employees/${updatedLeave.employeeID}`, { leaveBalance: req.body.status == "APPROVED" ? employee.leaveBalance - updatedLeave.totalDays : employee.leaveBalance })
                    .then(data => {
                        console.log(data);
                    })
            } catch (error) {
                console.log(error);
            }
            res.status(200).json({ success: 1, updatedLeave: updatedLeave })
        } else {
            res.status(200).json({ fail: 1, message: "Fail to update" })
        }
    }
})

module.exports = {
    getLeaves,
    findLeave,
    setLeave,
    updateLeave
}