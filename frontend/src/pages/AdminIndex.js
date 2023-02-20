

import React, { useState, useEffect } from "react";

import { Navigate, Link } from "react-router-dom";

const AdminIndex = () => {

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

    const [logout, setLogout] = useState(false)

    const logoutAction = () => {
        // alert("sadas")
        sessionStorage.removeItem("session_id")
        getSession()
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

                            <img className="rounded-circle" src="assets/img/avatar3.png" alt="" style={{ width: 40, height: 40 }} />
                            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1">
                            </div>

                        </div>

                        <div className="ms-3">
                            <h6 className="mb-0">Human Resource(HR)</h6>
                            <span>Admin</span>
                        </div>

                    </div>

                    <div className="navbar-nav w-100">

                        <Link to="/adminIndex"><div className="nav-item nav-link active"><i className="fa fa-tachometer-alt me-2"></i>Admin Dashboard</div></Link>

                        <Link to="/employee"><div className="nav-item nav-link"><i className="fa fa-user me-2"></i>Employees</div></Link>
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

                        {/* <div className="nav-item dropdown">

                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <i className="fa fa-envelope me-lg-2"></i>
                                <span className="d-none d-lg-inline-flex">Message</span>
                            </a>

                            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                                <a href="#" className="dropdown-item">
                                    <div className="d-flex align-items-center">
                                        <img className="rounded-circle" src="assets/img/user.jpg" alt="" style={{ width: 40, height: 40 }} />
                                        <div className="ms-2">
                                            <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                                            <small>15 minutes ago</small>
                                        </div>
                                    </div>
                                </a>
                                <hr className="dropdown-divider" />

                                <a href="#" className="dropdown-item">
                                    <div className="d-flex align-items-center">
                                        <img className="rounded-circle" src="assets/img/user.jpg" alt="" style={{ width: 40, height: 40 }} />
                                        <div className="ms-2">
                                            <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                                            <small>15 minutes ago</small>
                                        </div>
                                    </div>
                                </a>
                                <hr className="dropdown-divider" />
                                <a href="#" className="dropdown-item">
                                    <div className="d-flex align-items-center">
                                        <img className="rounded-circle" src="aseets/img/user.jpg" alt="" style={{ width: 40, height: 40 }} />
                                        <div className="ms-2">
                                            <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                                            <small>15 minutes ago</small>
                                        </div>
                                    </div>
                                </a>
                                <hr className="dropdown-divider" />
                                <a href="#" className="dropdown-item text-center">See all message</a>
                            </div>
                        </div>

                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <i className="fa fa-bell me-lg-2"></i>
                                <span className="d-none d-lg-inline-flex">Notification</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                                <a href="#" className="dropdown-item">
                                    <h6 className="fw-normal mb-0">Profile updated</h6>
                                    <small>15 minutes ago</small>
                                </a>
                                <hr className="dropdown-divider" />
                                <a href="#" className="dropdown-item">
                                    <h6 className="fw-normal mb-0">New user added</h6>
                                    <small>15 minutes ago</small>
                                </a>
                                <hr className="dropdown-divider" />
                                <a href="#" className="dropdown-item">
                                    <h6 className="fw-normal mb-0">Password changed</h6>
                                    <small>15 minutes ago</small>
                                </a>
                                <hr className="dropdown-divider" />
                                <a href="#" className="dropdown-item text-center">See all notifications</a>
                            </div>
                        </div> */}

                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <img className="rounded-circle me-lg-2" src="assets/img/avatar3.png" alt="" style={{ width: 40, height: 40 }} />
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
                <div class="mb-3 row">
                                    <div class="col-12">
                                        
    
                                        <img className="img-fluid" src="assets/img/admin.png" />
                                    </div>
                                </div>
                </div>


                {/* <div class="container-fluid pt-4 px-4">
                    <div class="row g-4">
                        <div class="col-sm-12 col-xl-6">
                            <div class="bg-light text-center rounded p-4">
                                <div class="d-flex align-items-center justify-content-between mb-4">
                                    <h6 class="mb-0">Worldwide Sales</h6>
                                    <a href="">Show All</a>
                                </div>
                                <canvas id="worldwide-sales"></canvas>
                            </div>
                        </div>
                        <div class="col-sm-12 col-xl-6">
                            <div class="bg-light text-center rounded p-4">
                                <div class="d-flex align-items-center justify-content-between mb-4">
                                    <h6 class="mb-0">Salse & Revenue</h6>
                                    <a href="">Show All</a>
                                </div>
                                <canvas id="salse-revenue"></canvas>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div >
        </>
    )
}

export default AdminIndex;