
import React, { useState, useEffect } from 'react'

import { Navigate, Link } from 'react-router-dom'

import Calendar from 'moedim';
import Clockk from 'react-live-clock';

import axios from 'axios';

const Clock = () => {

    const [openState, setOpenState] = useState(false)

    const [globalId, setGlobalID] = useState("")
    const [globalName, setGlobalName] = useState("")

    const getSession = () => {
        const session_id = sessionStorage.getItem("session_id");
        const session_fullname = sessionStorage.getItem("session_fullname");

        // alert(JSON.stringify(session_all))
        if (!session_id) {
            window.location.href = "/"
        } else {
            setGlobalID(session_id)
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

    const [disableClockin, setDisableClockin] = useState(false)
    const [disableClockout, setDisableClockout] = useState(true)

    const [todayDate, setTodayDate] = useState("")

    const [todayAttendance, setTodayAttendance] = useState("")
    const [todayClockIn, setTodayClockIn] = useState(null)
    const [todayClockOut, setTodayClockOut] = useState(null)
    const [todayLateness, setTodayLateness] = useState(null)
    const [todayOvertime, setTodayOvertime] = useState(null)
    const [todayAttendanceID, setTodayAttendanceID] = useState(null)

    const getTodayAttendance = () => {
        try {

            const kualaLumpurTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
            const year = kualaLumpurTime.getFullYear();
            const month = String(kualaLumpurTime.getMonth() + 1).padStart(2, '0');
            const day = String(kualaLumpurTime.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;
            // const formattedKLTime = kualaLumpurTime.toISOString().slice(0, 10);

            // alert(formattedDate)

            setTodayDate(formattedDate)

            const session_id = sessionStorage.getItem("session_id")
            // alert(sessionStorage.getItem("session_id"))
            axios.post(`http://localhost:5010/api/attendances/find/${session_id}`, {
                date: formattedDate
            }).then(data => {
                if (data.data.success === 1) {
                    setDisableClockin(true)
                    setDisableClockout(false)
                    setTodayAttendance(data.data)
                    setTodayAttendanceID(data.data.attendance._id)
                    let tlateness = data.data.attendance.lateness
                    const hours = Math.floor(tlateness / 60);
                    const remainingMinutes = tlateness % 60;
                    setTodayLateness(`${hours} Hour(s) and ${remainingMinutes} Minute(s)`)
                    let tovertime = data.data.attendance?.overtime
                    const hours2 = Math.floor(tovertime / 60);
                    const remainingMinutes2 = tovertime % 60;
                    setTodayOvertime(`${hours2} Hour(s) and ${remainingMinutes2} Minute(s)`)

                    let date = new Date(data.data.attendance.clockIn);
                    let offset = 8; // Kuala Lumpur offset is 8 hours ahead of UTC
                    date = new Date(date.getTime() + offset * 60 * 60 * 1000);
                    let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
                    setTodayClockIn(formattedDate);

                    let date2 = new Date(data.data.attendance.clockOut);
                    let offset2 = 8; // Kuala Lumpur offset is 8 hours ahead of UTC
                    date2 = new Date(date2.getTime() + offset2 * 60 * 60 * 1000);
                    let formattedDate2 = date2.toISOString().slice(0, 19).replace('T', ' ');
                    setTodayClockOut(formattedDate2); // "2023-01-23 12:29:29"
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTodayAttendance()
    }, [])

    const [adminLat, setAdminLat] = useState(null)
    const [adminLon, setAdminLon] = useState(null)
    const [adminRadius, setAdminRadius] = useState(null)

    const [adminSettingsOK, setAdminSettingsOK] = useState(false)

    const getAdminSettings = async () => {
        try {
            axios.get("http://localhost:5010/api/location").then(data => {
                if (data.data.success == 1) {
                    // const dis = getLocation()
                    setAdminLat(data.data.location.latitude)
                    setAdminLon(data.data.location.longitude)
                    setAdminRadius(data.data.location.radius)
                    setAdminSettingsOK(true)
                } else {
                    alert("Fail to get Admin Location Settings! Please Contact Admin!")
                    setAdminSettingsOK(false)
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getAdminSettings()
    }, [])

    const clockInClick = () => {
        if (adminSettingsOK)
            getLocation()
        else
            alert("Fail to get Admin Location Settings! Please Contact Admin!")
    }

    const submitAttendance = async (lat, lon) => {

        var now = new Date();
        var offset = now.getTimezoneOffset() / 60;
        now.setHours(now.getHours() + offset + 8);


        var currentTime = new Date();
        var year = currentTime.getFullYear();
        var month = currentTime.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = currentTime.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var hours = currentTime.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }
        var minutes = currentTime.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds = currentTime.getSeconds();
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        var attendanceDate = year + "-" + month + "-" + day;

        //compare with 8.00AM
        var currentTime = new Date();
        var eightAM = new Date();
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
        var currentTime2 = new Date();
        var eightAM2 = new Date();
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

        const kualaLumpurTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
        const yearr = kualaLumpurTime.getFullYear();
        const monthh = String(kualaLumpurTime.getMonth() + 1).padStart(2, '0');
        const dayy = String(kualaLumpurTime.getDate()).padStart(2, '0');

        const formattedDate = `${yearr}-${monthh}-${dayy}`;

        try {
            axios.post(`http://localhost:5010/api/attendances/${globalId}`, {
                attendanceDate: formattedDate, clockIn: now,
                lateness, overTime, latitude: lat, longitude: lon
            })
                .then(data => {
                    if (data.data.success === 1) {
                        alert("You have successfully clocked in.")
                        setDisableClockin(true)

                        getTodayAttendance()
                    } else {
                        alert("Error! Please contact admin")
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const submitClockOut = (attendanceid) => {
        var now = new Date();
        var offset = now.getTimezoneOffset() / 60;
        now.setHours(now.getHours() + offset + 8);

        //compare with 5.00PM
        var currentTime2 = new Date();
        var eightAM2 = new Date();
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

        // alert(overTime)

        try {
            axios.put(`http://localhost:5010/api/attendances/${attendanceid}`, {
                clockOut: now, overtime: overTime
            })
                .then(data => {
                    if (data.data.success === 1) {
                        getTodayAttendance()
                    } else {
                        alert("Error! Please contact admin.")
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [status, setStatus] = useState(null);

    const getLocation = async () => {

        if (!navigator.geolocation) {
            setStatus(`Geolocation is not supported by your browser. You can't clock in without location data.`)
        } else {
            setStatus("Location...")
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setStatus(null)
                    setLat(position.coords.latitude)
                    setLng(position.coords.longitude)
                    console.log(`this latitdue: ${position.coords.latitude} | this longitude: ${position.coords.longitude}`);

                    let dis = distance(position.coords.latitude, position.coords.longitude, parseFloat(adminLat), parseFloat(adminLon), "K")

                    dis = dis.toFixed(2);

                    if (dis > adminRadius) {
                        alert(`You are not allowed to Clock In since you are ${dis} KM from Working Location which exceeds the ${adminRadius} KM Radius that has been set by Admin!`)
                    } else {
                        submitAttendance(position.coords.latitude, position.coords.longitude)
                    }

                }, () => {
                    setStatus("Unable to retrieve your location. You can't clock in without location data.")
                }
            )
        }
    }

    const distance = (lat1, lon1, lat2, lon2, unit) => {

        // lat2 = 3.0705901315293627
        // lon2 = 101.50464789139416

        console.log(`lat2: ${lat2} | lon2:  ${lon2}`);

        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
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
                        <div class="col-sm-12">
                            <div class="bg-light rounded p-4 text-center">
                                <i class="fa fa-clock display-1 text-primary"></i> <br />
                                <Clockk format={'YYYY-MM-DD HH:mm:ss'} ticking={true} timezone={'Asia/Kuala_Lumpur'} style={{ fontSize: '50px' }} />
                                <br />
                                <br />
                                <button type='button' className="btn btn-primary me-2"
                                    onClick={() => clockInClick()}
                                    disabled={todayClockIn == null ? false : true}
                                >
                                    Clock In
                                </button>
                                <button type='button' className="btn btn-primary me-2"
                                    onClick={() => submitClockOut(todayAttendanceID)}
                                    disabled={todayClockOut == null && todayClockIn == null ?
                                        true : todayClockOut == null && todayClockIn != null ? false : true}
                                >
                                    Clock Out
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-light rounded p-4 text-center">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            {/* <th>ID</th> */}
                                            <th>Date</th>
                                            <th>Clock In</th>
                                            <th>Clock Out</th>
                                            <th>Lateness</th>
                                            <th>Overtime</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {/* <td>{todayAttendanceID}</td> */}
                                            <td>{todayDate}</td>
                                            <td>{todayClockIn}</td>
                                            <td>{todayClockOut}</td>
                                            {/* <td>{todayLateness == null ? 0 : todayLateness} Minutes</td> */}
                                            <td>{todayLateness == null ? null : todayLateness}</td>
                                            <td>{todayOvertime == null ? null : todayOvertime}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-12">
                            <button onClick={getLocation}>Get Location</button>
                            <h1>Coordinates</h1>
                            <p>{status}</p>
                            {lat && <p>Latitude: {lat}</p>}
                            {lng && <p>Longtitude: {lng}</p>}
                        </div>
                    </div> */}
                    {/* <div className="row">
                        <div className="col-12">
                            <h1>Admin Location Settings</h1>
                            <p>{JSON.stringify(adminLat)}</p>
                            <p>{JSON.stringify(adminLon)}</p>
                            <p>{JSON.stringify(adminRadius)}</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Clock