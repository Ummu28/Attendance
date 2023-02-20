const asyncHandler = require("express-async-handler")

const Employee = require("../models/employeeModel")

const login = asyncHandler(async (req, res) => {
    const employee = await Employee.findOne({ email: req.body.email });

    if (employee) {
        if (employee.email == req.body.email && employee.passwd == req.body.password) {
            res.status(200).json(employee)
        } else {
            res.json({ error: "Username and Password Incorrect!" })
        }
    } else {
        res.json({ error: "Username and Password Incorrect!" })
    }
})

module.exports = {
    login
}