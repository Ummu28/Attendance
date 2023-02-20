

import React, { useState, useEffect } from "react";

import { Navigate, Link } from "react-router-dom";

import { useParams } from 'react-router-dom';

import axios from "axios";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"

const AdminAtt = ({ match }) => {

    const { id } = useParams()

    const [openState, setOpenState] = useState(false)

    const getSession = () => {
        const session_id = sessionStorage.getItem("session_id");


        if (!session_id) {
            window.location.href = "/"
        }
    }

    useEffect(() => {
        getSession()
    }, [])

    useEffect(() => {
        // alert(id)
    }, [])

    const [logout, setLogout] = useState(false)

    const logoutAction = () => {
        // alert("sadas")
        sessionStorage.removeItem("session_id")
        getSession()
    }

    const [attendancesList, setAttendancesList] = useState([])

    const getAttendances = async () => {
        const session_id = sessionStorage.getItem("session_id");

        const date = new Date();
        const klTimeZone = date.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" });
        const currentMonthKL = new Date(klTimeZone).toISOString().slice(0, 7);
        // alert(JSON.stringify(currentMonthKL));

        try {
            axios.post(`http://localhost:5010/api/attendances/employee/${id}`, { thismonth: currentMonthKL })
                .then(data => {
                    // console.log(JSON.stringify(data.data));
                    if (data.data.success == 1) {
                        setAttendancesList(data.data.attendances)
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAttendances()
    }, [])

    const [lgShow, setLgShow] = useState(false)

    const [thisUsername, setThisUsername] = useState(null)
    const [thisLocation, setThisLocation] = useState(null)
    const [thisAttendanceID, setThisAttendanceID] = useState(null)
    const [thisAttendanceDate, setThisAttendanceDate] = useState(null)

    const [inputs, setInputs] = useState({})
    const [inputs2, setInputs2] = useState({})

    const changeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let date = new Date(value);
        let offset = -8;
        date = new Date(date.getTime() + offset * 60 * 60 * 1000);
        // let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        setInputs((values) => ({ ...values, [name]: value }));
        setInputs2((values) => ({ ...values, [name]: date }));
    };

    const getEmployeeData = async (empID, id) => {
        // alert(empID)\

        try {
            axios.get(`http://localhost:5010/api/employees/find/${empID}`).then(data => {
                setThisUsername(data.data.username)
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handlesubmit = (e) => {
        e.preventDefault();

        //compare with 8.00AM
        var currentTime = new Date(inputs.clockIn);
        var eightAM = new Date(thisAttendanceDate);
        eightAM.setHours(8, 0, 0, 0);
        var timeDiff = currentTime - eightAM;
        var diffInMinutes = timeDiff / (1000 * 60);
        var diffInHours = Math.floor(diffInMinutes / 60);
        var diffInMinutes = Math.floor(diffInMinutes % 60);
        diffInMinutes = Math.abs(diffInMinutes)
        if (diffInMinutes < 10) {
            diffInMinutes = "0" + diffInMinutes;
        }

        if (diffInHours >= 0) {
            var timeDifference = + diffInHours + ":" + diffInMinutes;
        } else {
            var timeDifference = diffInHours + ":" + diffInMinutes;
        }
        // alert(timeDifference);
        var lateness = 0
        if (timeDifference.substring(0, 1) == "-") {
            lateness = 0
        } else {

            if (Math.abs(diffInHours) > 0) {
                diffInMinutes = (diffInHours * 60) + diffInMinutes
            } else {
                diffInMinutes = diffInMinutes
            }
            lateness = diffInMinutes
        }

        //compare with 5.00PM
        var currentTime2 = new Date(inputs.clockOut);
        var eightAM2 = new Date(thisAttendanceDate);
        eightAM2.setHours(17, 0, 0, 0);
        var timeDiff2 = currentTime2 - eightAM2;
        var diffInMinutes2 = timeDiff2 / (1000 * 60);
        var diffInHours2 = Math.floor(diffInMinutes2 / 60);
        var diffInMinutes2 = Math.floor(diffInMinutes2 % 60);
        diffInMinutes2 = Math.abs(diffInMinutes2)
        if (diffInMinutes2 < 10) {
            diffInMinutes2 = "0" + diffInMinutes2;
        }

        if (diffInHours2 >= 0) {
            var timeDifference2 = + diffInHours2 + ":" + diffInMinutes2;
        } else {
            var timeDifference2 = diffInHours2 + ":" + diffInMinutes2;
        }
        // alert(timeDifference2);

        var overTime = 0

        if (timeDifference2.substring(0, 1) == "-") {
            overTime = 0
        } else {
            if (Math.abs(diffInHours2) > 0) {
                diffInMinutes2 = (diffInHours2 * 60) + diffInMinutes2
            } else {
                diffInMinutes2 = diffInMinutes2
            }
            overTime = diffInMinutes2
        }

        try {
            axios.put(`http://localhost:5010/api/attendances/${thisAttendanceID}`, {
                clockIn: inputs.clockIn,
                clockOut: inputs.clockOut,
                lateness,
                overtime: overTime
            }).then(data => {
                if (data.data.success === 1) {
                    getAttendances()
                    setLgShow(false)
                    alert("You have successfully updated the time!")
                } else {
                    alert("Update Error! Please Contact Admin!")
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    const getThisLocation = async (attendanceid) => {
        try {
            axios.get(`http://localhost:5010/api/attendances/findbyid/${attendanceid}`).then(data => {
                // alert(JSON.stringify(data))
                if (data.data.success == 1) {
                    setThisLocation(`${data.data.attendance.latitude}, ${data.data.attendance.longitude}`)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className={`sidebar pe-4 pb-3 ${openState ? "open" : ""}`}>
                <nav className="navbar bg-light navbar-light">

                    <a className="navbar-brand mx-4 mb-3">
                        <h3 className="text-primary"><i className="fa fa-hashtag me-2"></i>WORKXY</h3>
                    </a>

                    <div className="d-flex align-items-center ms-4 mb-4">
                        <div className="position-relative">

                            <img className="rounded-circle" src="../assets/img/avatar3.png" alt="" style={{ width: 40, height: 40 }} />
                            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1">
                            </div>

                        </div>

                        <div className="ms-3">
                        <h6 className="mb-0">Human Resource(HR)</h6>
                            <span>Admin</span>
                        </div>

                    </div>

                    <div className="navbar-nav w-100">

                        <Link to="/adminIndex"><div className="nav-item nav-link"><i className="fa fa-tachometer-alt me-2"></i>Admin Dashboard</div></Link>

                        <Link to="/employee"><div className="nav-item nav-link active"><i className="fa fa-user me-2"></i>Employees</div></Link>
                        <Link to="/adminLeave"><div className="nav-item nav-link"><i className="fa fa-keyboard me-2"></i>Leave Request</div></Link>
                        {/* <a href="table.html" className="nav-item nav-link"><i className="fa fa-table me-2"></i>Tables</a>
                        <a href="chart.html" className="nav-item nav-link"><i className="fa fa-chart-bar me-2"></i>Charts</a>
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown"><i className="far fa-file-alt me-2"></i>Pages</a>
                            <div className="dropdown-menu bg-transparent border-0">
                                <a href="signin.html" className="dropdown-item">Sign In</a>
                                <a href="signup.html" className="dropdown-item">Sign Up</a>
                                <a href="404.html" className="dropdown-item">404 Error</a>
                                <a href="blank.html" className="dropdown-item">Blank Page</a>
                            </div>
                        </div> */}

                    </div>
                </nav>
            </div >
            <div className={`content ${openState ? "open" : ""}`}>

                <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
                    <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
                        <h2 className="text-primary mb-0"><i className="fa fa-hashtag"></i></h2>
                    </a>
                    <button className="sidebar-toggler flex-shrink-0" style={{ border: 0 }} onClick={() => setOpenState(!openState)}>
                        <i className="fa fa-bars"></i>
                    </button>
                    {/* <form className="d-none d-md-flex ms-4">
                        <input className="form-control border-0" type="search" placeholder="Search" />
                    </form> */}
                    <div className="navbar-nav align-items-center ms-auto">

                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <img className="rounded-circle me-lg-2" src="../assets/img/avatar3.png" alt="" style={{ width: 40, height: 40 }} />
                                <span className="d-none d-lg-inline-flex">Human Resource</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                                <Link to={"/setting"}><div href="#" className="dropdown-item">Settings</div></Link>
                                <a onClick={() => { logoutAction() }} className="dropdown-item">Log Out</a>
                            </div>
                        </div>
                    </div>

                </nav>

                <div class="container-fluid pt-4 px-4">
                    <div class="row g-4">
                        <div class="col-sm-12">
                            <div class="bg-light p-4">
                                <h6 class="mb-2">Daily Clock Log</h6>
                                <table className="table table-striped">

                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Clock In</th>
                                            <th>Clock Out</th>
                                            <th>Total Hour</th>
                                            <th>Lateness</th>
                                            <th>Total Overtime</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendancesList.length > 0 ? attendancesList.map((item, index) => {

                                            let date = new Date(item.clockIn);
                                            let offset = 8;
                                            date = new Date(date.getTime() + offset * 60 * 60 * 1000);
                                            let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

                                            var date2, offset2, formattedDate2

                                            if (item.clockOut != null) {
                                                date2 = new Date(item.clockOut);
                                                offset2 = 8;
                                                date2 = new Date(date2.getTime() + offset2 * 60 * 60 * 1000);
                                                formattedDate2 = date2.toISOString().slice(0, 19).replace('T', ' ');
                                            }

                                            if (item.lateness > 60) {
                                                var num = item.lateness;
                                                var hours = (num / 60);
                                                var rhours = Math.floor(hours);
                                                var minutes = (hours - rhours) * 60;
                                                var rminutes = Math.round(minutes);
                                                var final = rhours + " hour(s) and " + rminutes + " minute(s).";

                                            } else {
                                                var final = item.lateness
                                            }

                                            if (item.overtime > 60) {
                                                var num2 = item.overtime;
                                                var hours2 = (num2 / 60);
                                                var rhours2 = Math.floor(hours2);
                                                var minutes2 = (hours2 - rhours2) * 60;
                                                var rminutes2 = Math.round(minutes2);
                                                var final2 = rhours2 + " hour(s) and " + rminutes2 + " minute(s).";

                                            } else {
                                                var final2 = item.overtime + " Minute(s)"
                                            }

                                            const diffMs = new Date(item.clockOut) - new Date(item.clockIn);

                                            // Convert milliseconds to hours and minutes
                                            const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                                            const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

                                            var totalHours = `The difference is ${diffHrs} hours and ${diffMins} minutes.`

                                            if (item.clockIn != null || item.clockIn != "") {
                                                var thisdate = new Date(item.clockIn);
                                                var thisoffset = -8;
                                                thisdate = new Date(thisdate.getTime() + offset * 60 * 60 * 1000);
                                            }
                                            if (item.clockOut != null || item.clockOut != "") {
                                                var thisdate2 = new Date(item.clockOut);
                                                var thisoffset = -8;
                                                thisdate2 = new Date(thisdate2.getTime() + offset * 60 * 60 * 1000);
                                            }
                                            var thisLoc = `${item.latitude}, ${item.longitude}`

                                            return (
                                                <tr key={index}>
                                                    <td>{item.attendanceDate}</td>
                                                    <td>{formattedDate}</td>
                                                    <td>{formattedDate2 != null ? formattedDate2 : null}</td>
                                                    <td>{totalHours}</td>
                                                    <td>{item.lateness < 60 ? item.lateness + " Minute(s)" : final}</td>
                                                    <td>{item.overtime == null ? 0 + " Minute" : final2}</td>
                                                    <td><div onClick={() => {
                                                        setLgShow(true)
                                                        getEmployeeData(item.employeeID, item._id)
                                                        setThisAttendanceID(item._id)
                                                        setThisAttendanceDate(item.attendanceDate)
                                                        setInputs({
                                                            clockIn: new Date(thisdate).toISOString().substring(0, 16),
                                                            clockOut: new Date(thisdate2).toISOString().substring(0, 16)
                                                        })
                                                        getThisLocation(item._id)
                                                    }} className="btn btn-success">Edit</div></td>
                                                    <Modal
                                                        size="lg"
                                                        show={lgShow}
                                                        onHide={() => setLgShow(false)}
                                                        aria-labelledby="example-modal-sizes-title-lg"
                                                    >
                                                        <form
                                                            onSubmit={handlesubmit}
                                                            action="post"
                                                            enctype="multipart/form-data"
                                                            name="fileinfo"
                                                        >
                                                            <Modal.Header closeButton>
                                                                <Modal.Title id="example-modal-sizes-title-md">
                                                                    Modify Attendance Form
                                                                </Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                {/* {JSON.stringify(inputs2)} | {thisAttendanceID} */}
                                                                <div class="row g-3">
                                                                    {/* <div className="col-12">{JSON.stringify(inputs)}</div> */}
                                                                    <div class="col-sm-6 mb-3">
                                                                        <label for="exampleFormControlInput1" class="form-label">Username</label>
                                                                        <input
                                                                            readOnly
                                                                            required
                                                                            name="username"
                                                                            value={thisUsername}
                                                                            type="text" class="form-control" id="exampleFormControlInput1" />
                                                                    </div>
                                                                    <div class="col-sm-6 mb-3">
                                                                        <label for="exampleFormControlTextarea1" class="form-label">Clock In</label>
                                                                        <input
                                                                            required
                                                                            name="clockIn"
                                                                            onChange={changeHandler}
                                                                            value={inputs.clockIn || new Date(thisdate).toISOString().substring(0, 16)}
                                                                            type="datetime-local" class="form-control" id="exampleFormControlInput1" />
                                                                    </div>
                                                                </div>
                                                                <div class="row g-3">
                                                                    {/* <div className="col-12">{JSON.stringify(inputs)}</div> */}
                                                                    <div class="col-sm-6 mb-3">
                                                                        <label for="exampleFormControlInput1" class="form-label">Clock Out</label>
                                                                        <input
                                                                            required
                                                                            name="clockOut"
                                                                            onChange={changeHandler}
                                                                            value={inputs.clockOut || new Date(thisdate2).toISOString().substring(0, 16)}
                                                                            type="datetime-local" class="form-control" id="exampleFormControlInput1" />
                                                                    </div>
                                                                    <div class="col-sm-6 mb-3">
                                                                        <label for="exampleFormControlTextarea1" class="form-label">Location</label>
                                                                        <input
                                                                            readOnly
                                                                            required
                                                                            name="location"
                                                                            value={thisLocation}
                                                                            type="text" class="form-control" id="exampleFormControlInput1" />
                                                                    </div>
                                                                </div>

                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => setLgShow(false)}>
                                                                    Close
                                                                </Button>
                                                                <button type="submit" className="btn btn-primary" onClick={{}}>
                                                                    Update Changes
                                                                </button>
                                                            </Modal.Footer>
                                                        </form>
                                                    </Modal>
                                                </tr>

                                            )
                                        }) : <tr><td colSpan={7} className="text-center">No Attendance recorded by this employee this month yet!</td></tr>}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>

            </div >
        </>
    )
}

export default AdminAtt;