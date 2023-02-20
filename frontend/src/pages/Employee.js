

import React, { useState, useEffect, useRef } from "react";

import { Navigate, Link } from "react-router-dom";

import axios from "axios"

const Employee = () => {

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



    const myRefname = useRef(null);
    const handleClick = () => {
        myRefname.click();
        return false;
    }

    const [openState, setOpenState] = useState(false)

    const [employeeList, setEmployeeList] = useState([])

    const getEmployees = async () => {
        try {
            axios.get("http://localhost:5010/api/employees").then(data => {
                // alert((JSON.stringify(data.data)))
                setEmployeeList(data.data)
            })


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getEmployees()
    }, [])

    const [inputs, setInputs] = useState({});

    // useEffect(() => {
    //     inputs.state = 1;
    // }, []);

    const changeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
        console.log(inputs);
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        if (inputs.password != inputs.password2) {
            alert('Please make sure both passwords are same.',)
        }
        else {
            if (inputs.email == null || inputs.password == null || inputs.password2 == null || inputs.fullname == null ||
                inputs.username == null || inputs.dob == null || inputs.gender == null || inputs.city == null || inputs.noHp == null
                || inputs.dateJoin == null) {
                { inputs.email == null ? alert("emaill") : console.log("email ok") }
                { inputs.password == null ? alert("password") : console.log("password ok") }
                { inputs.password2 == null ? alert("password2") : console.log("password2 ok") }
                { inputs.fullname == null ? alert("fullname") : console.log("fullname ok") }
                { inputs.username == null ? alert("username") : console.log("username ok") }
                { inputs.dob == null ? alert("dob") : console.log("dob ok") }
                { inputs.gender == null ? alert("gender") : console.log("gender ok") }
                { inputs.city == null ? alert("city") : console.log("city ok") }
                { inputs.noHp == null ? alert("noHp") : console.log("noHp ok") }
                { inputs.dateJoin == null ? alert("dateJoin") : console.log("dateJoin ok") }

                alert('Please fill in all information in the Registration Form!')
            } else {

                // var form = document.forms.namedItem("registerform");

                // const fd = new FormData(form);

                // alert(JSON.stringify(inputs))

                // const response = await fetch("http://localhost:5010/api/employees", {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(inputs)
                // })
                // const data = await response.json();

                // alert(JSON.stringify(data))

                axios.post("http://localhost:5010/api/employees", inputs)
                    .then(data => {
                        if (!data.data.message) {
                            // alert(JSON.stringify(data))
                            if (data.data.success === 1) {
                                alert("Employee successfully added")
                                getEmployees()
                            }
                        } else {
                            // alert("Error! Please Contact Admin!")
                            alert(JSON.stringify(data.data.message))
                        }
                    }
                    )
            }
        }
    };

    const [foundEmployee, setFoundEmployee] = useState([])

    const findEmployee = async (id) => {
        axios.get(`http://localhost:5010/api/employees/find/${id}`)
            .then(data => {
                setFoundEmployee(data.data)

                setDobDate(data.data.dob, data.data.dateJoin)
            })
    }

    const setDobDate = (dobdate, datejoin) => {
        const timestamp = dobdate;
        const date = new Date(timestamp);

        const timestamp2 = datejoin;
        const date2 = new Date(timestamp2);

        setFoundEmployee((values) => ({ ...values, dob: date.toISOString().split('T')[0], dateJoin: date2.toISOString().split('T')[0] }))
    }

    const changeHandler2 = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFoundEmployee((values) => ({ ...values, [name]: value }));
        console.log(foundEmployee);
    };

    const submitHandler2 = async (event) => {
        event.preventDefault();

        if (foundEmployee.password != foundEmployee.password2) {
            alert('Please make sure both passwords are same.',)
        }
        else {
            if (foundEmployee.email == null || foundEmployee.passwd == null || foundEmployee.passwdConf == null || foundEmployee.fullname == null ||
                foundEmployee.username == null || foundEmployee.dob == null || foundEmployee.gender == null || foundEmployee.city == null || foundEmployee.noHp == null
                || foundEmployee.dateJoin == null) {
                { foundEmployee.email == null ? alert("emaill") : console.log("email ok") }
                { foundEmployee.passwd == null ? alert("passwd") : console.log("password ok") }
                { foundEmployee.passwdConf == null ? alert("passwdConf") : console.log("password2 ok") }
                { foundEmployee.fullname == null ? alert("fullname") : console.log("fullname ok") }
                { foundEmployee.username == null ? alert("username") : console.log("username ok") }
                { foundEmployee.dob == null ? alert("dob") : console.log("dob ok") }
                { foundEmployee.gender == null ? alert("gender") : console.log("gender ok") }
                { foundEmployee.city == null ? alert("city") : console.log("city ok") }
                { foundEmployee.noHp == null ? alert("noHp") : console.log("noHp ok") }
                { foundEmployee.dateJoin == null ? alert("dateJoin") : console.log("dateJoin ok") }

                alert('Please fill in all information in the Registration Form!')
            } else {
                if (foundEmployee.passwd != foundEmployee.passwdConf) {
                    alert('Please make sure both passwords are same.',)
                }
                else {
                    // var form = document.forms.namedItem("registerform");

                    // const fd = new FormData(form);

                    // alert(JSON.stringify(inputs))

                    // const response = await fetch("http://localhost:5010/api/employees", {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(inputs)
                    // })
                    // const data = await response.json();

                    // alert(JSON.stringify(data))

                    axios.put(`http://localhost:5010/api/employees/${foundEmployee._id}`, foundEmployee)
                        .then(data => {
                            if (data.data.success === 1) {
                                alert(`${JSON.stringify(data.data.updatedEmployee.fullname)} information has been successfully updated!`)
                                getEmployees()
                            } else {
                                alert("Error! Please contact Admin!")
                            }
                        }
                        )
                }
            }
        }
    };

    const confirmDelete = (id) => {
        // e.preventDefault()
        if (window.confirm("Delete the item?")) {
            axios.delete(`http://localhost:5010/api/employees/${id}`)
                .then(data => {
                    alert(JSON.stringify(data.data.message))
                    getEmployees()
                })
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
                    <div class="row g-4">
                        <div class="col-sm-12">
                            <button type="button" className="btn btn-primary rounded-pill m-2" data-bs-toggle="modal" data-bs-target="#exampleModal"> <i className="fa fa-plus me-2"></i> Add Employees</button>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Username</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeeList.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.username}</td>
                                                <td>
                                                    <button type="button" onClick={() => findEmployee(item._id)} className="btn btn-success me-3" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                                        Edit Profile
                                                    </button>
                                                    <Link to={`/adminAtt/${item._id}`}><div className="btn btn-danger me-3">Edit Attendance</div></Link>
                                                    <Link to={`/adminReport/${item._id}`}><div className="btn btn-warning me-3">Employee Report</div></Link>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <form onSubmit={submitHandler}>
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Employee Registration Form</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">

                                    {/* <div class="col-6">
                                        <label for="exampleFormControlInput1" class="form-label">

                                            {JSON.stringify(inputs)} </label></div> */}
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                onChange={changeHandler}
                                                value={inputs.fullname || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                onChange={changeHandler}
                                                value={inputs.username || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                onChange={changeHandler}
                                                value={inputs.email || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                onChange={changeHandler}
                                                value={inputs.password || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="password2"
                                                onChange={changeHandler}
                                                value={inputs.password2 || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                onChange={changeHandler}
                                                value={inputs.dob || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Gender</label>
                                            <input
                                                type="text"
                                                name="gender"
                                                onChange={changeHandler}
                                                value={inputs.gender || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                onChange={changeHandler}
                                                value={inputs.city || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Phone Number</label>
                                            <input
                                                type="text"
                                                name="noHp"
                                                onChange={changeHandler}
                                                value={inputs.noHp || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Date Joined</label>
                                            <input
                                                type="date"
                                                name="dateJoin"
                                                onChange={changeHandler}
                                                value={inputs.dateJoin || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <input type="button" class="btn btn-secondary" data-bs-dismiss="modal" value="Close" />
                                    <button type="submit" class="btn btn-primary">Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <form onSubmit={submitHandler2}>
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Edit Employee Detail</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">

                                    {/* <div class="col-6">
                                        <label for="exampleFormControlInput1" class="form-label">

                                            {JSON.stringify(foundEmployee)} </label></div> */}
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                onChange={changeHandler2}
                                                value={foundEmployee.fullname || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                onChange={changeHandler2}
                                                value={foundEmployee.username || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                onChange={changeHandler2}
                                                value={foundEmployee.email || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Password</label>
                                            <input
                                                type="password"
                                                name="passwd"
                                                onChange={changeHandler2}
                                                value={foundEmployee.passwd || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="passwdConf"
                                                onChange={changeHandler2}
                                                value={foundEmployee.passwdConf || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                onChange={changeHandler2}
                                                value={foundEmployee.dob || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Gender</label>
                                            <input
                                                type="text"
                                                name="gender"
                                                onChange={changeHandler2}
                                                value={foundEmployee.gender || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                onChange={changeHandler2}
                                                value={foundEmployee.city || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Phone Number</label>
                                            <input
                                                type="text"
                                                name="noHp"
                                                onChange={changeHandler2}
                                                value={foundEmployee.noHp || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div class="col-6">
                                            <label for="exampleFormControlInput1" class="form-label">Date Joined</label>
                                            <input
                                                type="date"
                                                name="dateJoin"
                                                onChange={changeHandler2}
                                                value={foundEmployee.dateJoin || ""}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <input type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal" value="Close" />
                                    <button type="button" class="btn btn-danger me-2" onClick={(e) => confirmDelete(foundEmployee._id)}>Remove Employee</button>
                                    <button type="submit" class="btn btn-success">Update Profile</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div >
        </>
    )
}

export default Employee