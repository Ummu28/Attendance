const express = require("express")
const router = express.Router()

const { getEmployees, setEmployee, updateEmployee, deleteEmployee, findEmployee } = require("../controllers/employeeController")

router.route('/').get(getEmployees).post(setEmployee)

router.route('/find/:id').get(findEmployee)

router.route('/:id').put(updateEmployee).delete(deleteEmployee)

module.exports = router