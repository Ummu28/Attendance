
import React, { useState, useEffect } from 'react'

import { Navigate, Link } from 'react-router-dom'

import Calendar from 'moedim';

import axios from 'axios';

const Attendance = () => {

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

    const [value, setValue] = useState(new Date())

    const [attendanceList, setAttendanceList] = useState([])

    const getAttendances = async () => {

        var session_id = sessionStorage.getItem("session_id");

        var d = new Date();
        var currentMonth = d.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
        var currentYear = d.getFullYear();
        var currentDate = currentYear + "-" + currentMonth.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

        axios.post(`http://localhost:5010/api/attendances/employee/${session_id}`, {
            thismonth: currentDate
        }).then(data => {
            if (data.data.success === 1) {
                setAttendanceList(data.data.attendances)
            }
        })
    }

    useEffect(() => {
        getAttendances()
    }, [])

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

                        <Link to="/dashboard"><div className="nav-item nav-link"><i className="fa fa-tachometer-alt me-2"></i>Dashboard</div></Link>

                        <Link to="/attendance"><div className="nav-item nav-link active"><i className="fa fa-th me-2"></i>Attendance</div></Link>
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
                    <div className="row g-4">
                        <div className="col-sm-12">
                            <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                <h6>Daily Clock Logs for This Month</h6> <br />
                            </div>
                        </div>
                    </div>
                    <div class="row g-4">
                        <div class="col-sm-12">
                            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Clock In</th>
                                            <th>Clock Out</th>
                                            <th>Lateness</th>
                                            <th>Overtime</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceList.map((item, index) => {

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

                                            return (
                                                <tr key={index}>
                                                    <td>{item.attendanceDate}</td>
                                                    <td>{formattedDate}</td>
                                                    <td>{formattedDate2 != null ? formattedDate2 : null}</td>
                                                    <td>{item.lateness < 60 ? item.lateness + " Minute(s)" : final}</td>
                                                    <td>{item.overtime == null ? 0 + " Minute" : final2}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Attendance