

import React, { useState, useEffect } from "react";

import { Navigate, Link, useParams } from "react-router-dom";

import axios from "axios"

const AttReport = () => {

    const [globalID, setGlobalID] = useState(null)

    // setGlobalID(id)

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

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [thisCurrentMonth, setThisCurrentMonth] = useState()
    const [stringCurrentMonth, setStringCurrentMonth] = useState()

    const [thisPreviousMonth, setThisPreviousMonth] = useState()
    const [stringPreviousMonth, setStringPreviousMonth] = useState()

    const CurrentMonth = () => {

        const date = new Date();
        let currentMonth = date.getMonth();
        const currentMonthName = monthNames[currentMonth];

        currentMonth++
        setThisCurrentMonth(currentMonth)
        setStringCurrentMonth(currentMonthName)

        return (
            <>
                {/* <p>Current Month (digit): {currentMonth}</p>
                <p>Current Month (name): {currentMonthName}</p> */}
            </>
        );
    };

    const PreviousMonth = () => {
        const date = new Date();
        const currentMonth = date.getMonth();
        let previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousMonthName = monthNames[previousMonth];

        previousMonth++
        setThisPreviousMonth(previousMonth)
        setStringPreviousMonth(previousMonthName)

        return (
            <>
                {/* <p>Previous Month (digit): {previousMonth}</p>
                <p>Previous Month (name): {previousMonthName}</p> */}
            </>
        );
    };

    const [thisEmployee, setThisEmployee] = useState({})
    const [thisAttendances, setThisAttendances] = useState([])

    // const [value, setValue] = useState(1)

    const getEmployee = async () => {
        const session_id = sessionStorage.getItem("session_id");
        try {
            axios.get(`http://localhost:5010/api/employees/find/${session_id}`).then(data => {
                // alert(JSON.stringify(data))
                if (data.status === 200) {
                    setThisEmployee(data.data)

                    getAttendances(1)

                } else {
                    alert("Please Contact ADMIN!")
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getAttendances = async (value) => {
        const session_id = sessionStorage.getItem("session_id");
        try {
            const date = new Date();
            const currentMonth = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
            const previousMonth = date.getFullYear() + '-' + (date.getMonth()).toString().padStart(2, '0');

            axios.post(`http://localhost:5010/api/attendances/employee/${session_id}`, { thismonth: value == 1 ? previousMonth : currentMonth })
                .then(data => {
                    if (data.data.success === 1) {
                        setThisAttendances(data.data.attendances)
                    } else {
                        alert("Error! Please contact ADMIN!")
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getEmployee()
    }, [])

    const [stringLateness, setStringLateness] = useState("")
    const [stringOvertime, setStringOvertime] = useState("")
    const [stringHours, setStringHours] = useState("")

    const calculateAll = async () => {
        var totalLateness = 0
        var totalOvertime = 0
        var totalHours = 0

        thisAttendances.map((item, index) => {
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

        // alert(remainingMinutes3)

        // getAttendances()
    }

    useEffect(() => {
        calculateAll()
    }, [thisAttendances])


    return (
        <>
            <div className={`sidebar pe - 4 pb - 3 ${openState ? "open" : ""}`}>
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

                        <Link to="/dashboard"><div className="nav-item nav-link"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</div></Link>

                        <Link to="/attendance"><div className="nav-item nav-link"><i className="fa fa-th me-2"></i>Attendance</div></Link>
                        <Link to="/leave"><div className="nav-item nav-link"><i className="fa fa-keyboard me-2"></i>Leave Request</div></Link>
                        <Link to="/attReport"><div className="nav-item nav-link active"><i className="fa fa-file me-2"></i>Attendance Report</div></Link>
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
                    <form

                        className="d-none d-md-flex ms-4"
                    >
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
                        <div class="bg-light col-sm-12 p-4">
                            <h5>Attendance Report</h5>
                            <h1 className="text-center">Year 2023</h1>

                            <CurrentMonth />
                            <PreviousMonth />

                            <div class="mb-3">
                                <label class="form-label" style={{ fontWeight: "bold" }}>Username</label>
                                <input type="text" value={thisEmployee.username} class="form-control" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" style={{ fontWeight: "bold" }}>Month</label>
                                <select onChange={e => getAttendances(e.target.value)} className="form-control">
                                    <option value={1}>{stringPreviousMonth}</option>
                                    <option value={2}>{stringCurrentMonth}</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" style={{ fontWeight: "bold" }}>Total Hours</label>
                                <input type="text" value={stringHours} class="form-control" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" style={{ fontWeight: "bold" }}>Total Overtime</label>
                                <input type="text" value={stringOvertime} class="form-control" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label" style={{ fontWeight: "bold" }}>Total Lateness</label>
                                <input type="text" value={stringLateness} class="form-control" />
                            </div>
                            {/* {JSON.stringify(thisAttendances)} */}
                            {/* {thisAttendances.map((item, index) => {
                                return (
                                    <div>{item.clockIn} - {item.clockOut}</div>
                                )
                            })} */}
                        </div>
                    </div>
                </div>

            </div >
        </>
    )
}

export default AttReport;