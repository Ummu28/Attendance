const express = require("express")
const router = express.Router()

const { getAttendances, setAttendance, updateAttendance, findAttendance, getAttendancesByEmployee, getAttendanceById, getAllAttendancesByEmployee } = require("../controllers/attendanceController")

router.route('/').get(getAttendances)
router.route('/employee/:id').post(getAttendancesByEmployee)
router.route('/all/employee/:id').get(getAllAttendancesByEmployee)

router.route('/find/:id').post(findAttendance)
router.route('/findbyid/:id').get(getAttendanceById)


router.route('/:id').put(updateAttendance).post(setAttendance)

module.exports = router