
import React, { useState, useEffect } from 'react'

import { Navigate, Link } from 'react-router-dom'

import Calendar from 'moedim';

import axios from 'axios';

const Dashboard = () => {

    const [openState, setOpenState] = useState(false)

    const [globalName, setGlobalName] = useState("")

    const getSession = () => {
        const session_id = sessionStorage.getItem("session_id");
        const session_fullname = sessionStorage.getItem("session_fullname");

        // alert(JSON.stringify(session_all))
        if (!session_id) {
            window.location.href = "/"
        } else {
            setGlobalName(session_fullname)
            // alert(JSON.stringify(session))
        }
    }

    useEffect(() => {
        getSession()
    }, [])

    const [logout, setLogout] = useState(false)

    const logoutAction = () => {
        // alert("sadas")
        sessionStorage.removeItem("session_id")
        sessionStorage.removeItem("session_fullname")
        sessionStorage.removeItem("session_all")
        getSession()
    }

    // const [value, setValue] = useState(new Date())


    const [attendances, setAttendances] = useState([])
    const [employee, setEmployee] = useState([])

    const getEmployee = async () => {
        const session_id = sessionStorage.getItem("session_id");

        try {
            axios.get(`http://localhost:5010/api/employees/find/${session_id}`).then(data => {
                // alert(JSON.stringify(data.data))
                if (data.status == 200) {
                    setEmployee(data.data)
                } else {
                    alert("Error! Please cotnact ADMIN!")
                }
            })
        } catch (error) {
            console.log();
        }
    }
    const getAttendance = async () => {
        const session_id = sessionStorage.getItem("session_id");

        try {
            axios.get(`http://localhost:5010/api/attendances/all/employee/${session_id}`).then(data => {
                // alert(JSON.stringify(data.data))
                if (data.data.success == 1) {
                    setAttendances(data.data.attendances)
                } else {
                    alert("Error! Please cotnact ADMIN!")
                }
            })
        } catch (error) {
            console.log();
        }
    }

    useEffect(() => {
        getAttendance()
        getEmployee()
    }, [])

    const [stringLateness, setStringLateness] = useState("")
    const [stringOvertime, setStringOvertime] = useState("")
    const [stringHours, setStringHours] = useState("")

    const calculateAll = async () => {
        var totalLateness = 0
        var totalOvertime = 0
        var totalHours = 0

        attendances.map((item, index) => {
            totalLateness = totalLateness + item.lateness

            if (!isNaN(item.overtime))
                totalOvertime = totalOvertime + item.overtime

            if (item.clockOut != null || item.clockOut != "") {
                const date1 = new Date(item.clockIn);
                const date2 = new Date(item.clockOut);
                const diffInMinutes = (date2 - date1) / 1000 / 60;
                totalHours = totalHours + Math.round(diffInMinutes)
            }
        })

        const hours = Math.floor(totalLateness / 60);
        const remainingMinutes = totalLateness % 60;
        setStringLateness(`${hours} Hours and ${remainingMinutes} minutes`)

        const hours2 = Math.floor(totalOvertime / 60);
        const remainingMinutes2 = totalOvertime % 60;
        setStringOvertime(`${hours2} Hours and ${remainingMinutes2} minutes`)

        const hours3 = Math.floor(totalHours / 60);
        const remainingMinutes3 = totalHours % 60;
        setStringHours(`${hours3} Hours and ${remainingMinutes3} minutes`)
    }

    useEffect(() => {
        calculateAll()
    }, [attendances])



    return (
        <>
            <div className={`sidebar pe-4 pb-3 ${openState ? "open" : ""}`}>
                <nav className="navbar bg-light navbar-light">

                    <a className="navbar-brand mx-4 mb-3">
                        <h3 className="text-primary"><i className="fa fa-hashtag me-2"></i>WORKXY</h3>
                    </a>

                    <div className="d-flex align-items-center ms-4 mb-4">
                        <div className="position-relative">

                            <img className="rounded-circle" src="assets/img/avatar1.png" alt="" style={{ width: 40, height: 40 }} />
                            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1">
                            </div>

                        </div>

                        <div className="ms-3">
                            <h6 className="mb-0">{globalName}</h6>
                            <span>Employee</span>
                        </div>

                    </div>

                    <div className="navbar-nav w-100">

                        <Link to="/dashboard"><div className="nav-item nav-link active"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</div></Link>

                        <Link to="/attendance"><div className="nav-item nav-link"><i className="fa fa-th me-2"></i>Attendance</div></Link>
                        <Link to="/leave"><div className="nav-item nav-link"><i className="fa fa-keyboard me-2"></i>Leave Request</div></Link>
                        <Link to="/attReport"><div className="nav-item nav-link"><i className="fa fa-file me-2"></i>Attendance Report</div></Link>
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
                    <form className="d-none d-md-flex ms-4">
                        {/* <input className="form-control border-0" type="search" placeholder="Search" /> */}
                    </form>
                    <div className="navbar-nav align-items-center ms-auto">

                        <div className="nav-item dropdown">
                            <a href="/clock" class="nav-item nav-link" >
                                <i class="fa fa-clock me-lg-2"></i>
                                <span class="d-none d-lg-inline-flex">Web Clock In Capture</span>
                            </a>
                        </div>

                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <img className="rounded-circle me-lg-2" src="assets/img/avatar1.png" alt="" style={{ width: 40, height: 40 }} />
                                <span className="d-none d-lg-inline-flex">{(globalName)}</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                                {/* <a href="#" className="dropdown-item">My Profile</a>
                                <a href="#" className="dropdown-item">Settings</a> */}
                                <a className="dropdown-item" onClick={() => logoutAction()}>Log Out</a>
                            </div>
                        </div>
                    </div>

                </nav>

                <div class="container-fluid pt-4 px-4">
                    <div class="row g-4">
                        {/* <div class="col-sm-12 col-md-6 col-lg-4 col-xl-2">
                            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                <Calendar value={value} onChange={(d) => setValue(d)} style={{ width: 1000, height: 1000 }} />
                            </div>
                        </div> */}
                        <div class="col-sm-12">
                            <div class="row">
                                {/* <div>{JSON.stringify(attendances)}</div> */}
                                <div class="col-sm-12 col-md-6 mb-3">
                                    <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                        <i class="fa fa-clock fa-3x text-primary"></i>
                                        <div class="ms-3">
                                            <p class="mb-2">Work Hours</p>
                                            <h6 class="mb-0">{stringHours}</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6 mb-3">
                                    <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                        <i class="fa fa-suitcase fa-3x text-primary"></i>
                                        <div class="ms-3">
                                            <p class="mb-2">Overtime</p>
                                            <h6 class="mb-0">{stringOvertime}</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6 mb-3">
                                    <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                        <i class="fa fa-hourglass fa-3x text-primary"></i>
                                        <div class="ms-3">
                                            <p class="mb-2">Lateness</p>
                                            <h6 class="mb-0">{stringLateness}</h6>
                                        </div>
                                    </div>
                                </div>
                                {/* <div class="col-sm-12 col-md-6 mb-3">
                                    <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                        <i class="fa fa-user-times fa-3x text-primary"></i>
                                        <div class="ms-3">
                                            <p class="mb-2">Absents</p>
                                            <h6 class="mb-0">$1234</h6>
                                        </div>
                                    </div>
                                </div> */}
                                <div class="col-sm-12 col-md-6 mb-3">
                                    <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                        <i class="fa fa-calendar fa-3x text-primary"></i>
                                        <div class="ms-3">
                                            <p class="mb-2">Leave Entitled</p>
                                            <h6 class="mb-0">20 Days</h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6 mb-3">
                                    <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                        <i class="fa fa-check-square fa-3x text-primary"></i>
                                        <div class="ms-3">
                                            <p class="mb-2">Leave Balance</p>
                                            <h6 class="mb-0">{employee.leaveBalance} Days</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard