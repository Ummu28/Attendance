
import React, { useState, useEffect } from 'react'

import { Navigate, Link } from 'react-router-dom'

import Calendar from 'moedim';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Leave = () => {

    const [lgShow, setLgShow] = useState(false);

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

    const [thisUser, setThisUser] = useState([])

    const getEmployeeDetails = async () => {
        const session_id = sessionStorage.getItem("session_id");

        axios.get(`http://localhost:5010/api/employees/find/${session_id}`)
            .then(data => {
                setThisUser(data.data)
            })
    }

    const [leavesList, setLeavesList] = useState([])

    const getLeaves = async () => {
        const session_id = sessionStorage.getItem("session_id");

        axios.get(`http://localhost:5010/api/leaves/find/${session_id}`)
            .then(data => {
                setLeavesList(data.data)
            })
    }

    useEffect(() => {
        getEmployeeDetails()
        getLeaves()
    }, [])

    const [selectedImage, setSelectedImage] = useState("")
    const [selectedImageName, setSelectedImageName] = useState("")

    // const [leaveType, setLeaveType] = useState("")
    // const [beginDate, setBeginDate] = useState("")
    // const [endDate, setEndDate] = useState("")
    // const [endTotalDay, setTotalDay] = useState(0)
    // const [reason, setReason] = useState("")
    // const [documentName, setDocumentName] = useState("")

    const [inputs, setInputs] = useState({ leaveType: 1 })

    const onFileChange = (event) => {
        setSelectedImage(event.target.files[0]);
        setSelectedImageName(event.target.files[0].name);
    };

    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);



    const changeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name == "beginDate") {
            setDate1(value);
            calculateDifference()
        } else if (name == "endDate") {
            setDate2(value);
            calculateDifference()
        }

        setInputs((values) => ({ ...values, [name]: value }));
        console.log(inputs);
    };

    const [dayDiff, setDayDiff] = useState(0)

    const calculateDifference = () => {
        if (date1 != null || date2 != null) {
            const date1Object = new Date(date1);
            const date2Object = new Date(date2);
            const differenceInMilliseconds = date2Object.getTime() - date1Object.getTime();
            var differenceInDays = differenceInMilliseconds / 86400000;

            differenceInDays++

            if (differenceInDays => 0)
                setDayDiff(differenceInDays)
        }
    }

    useEffect(() => {
        if (date1 != null || date2 != null)
            calculateDifference()
    }, [date1, date2, dayDiff])


    const handlesubmit = (e) => {
        e.preventDefault();

        const session_id = sessionStorage.getItem("session_id");

        var form = document.forms.namedItem("fileinfo");
        const fd = new FormData(form);

        fd.append("employeeID", session_id);
        fd.append("file", selectedImage);

        var currentDate = new Date()

        const formattedDate = currentDate.toISOString().slice(0, -5).replace(/[:T]/g, '-');

        var newName = session_id + "_" + currentDate + "_" + selectedImageName

        fd.append("filename", newName);
        fd.append("currentDate", formattedDate);

        // alert(selectedImage)

        axios
            .post(
                `http://localhost:5010/api/leaves/${session_id}`,
                fd,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )
            .then((data) => {
                if (data.data.success == 1) {
                    getLeaves()
                    setLgShow()
                    alert("You have successfully applied the leave")

                } else {
                    alert(data.data)
                }
            })
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
                        <Link to="/leave"><div className="nav-item nav-link active"><i className="fa fa-keyboard me-2"></i>Leave Request</div></Link>
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
                    <div class="row">
                        <div class="col-sm-6 col-xl-3 mb-3">
                            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                <i class="fa fa-calendar fa-3x text-primary"></i>
                                <div class="ms-3">
                                    <p class="mb-2">Leave Entitled</p>
                                    <h6 class="mb-0">20 Days</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-xl-3 mb-3">
                            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                <i class="fa fa-check-square fa-3x text-primary"></i>
                                <div class="ms-3">
                                    <p class="mb-2">Leave Balanced</p>
                                    <h6 class="mb-0">{thisUser.leaveBalance} Days</h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-xl-3 mb-3">
                            <div class="rounded d-flex align-items-center justify-content-between p-4">
                                <button
                                    onClick={() => setLgShow(true)}
                                    className="btn btn-primary btn-lg rounded-pill m-2">Request Leave</button>
                            </div>
                        </div>

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
                                    <Modal.Title id="example-modal-sizes-title-lg">
                                        Leave Request Form
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>

                                    <div class="row g-3">
                                        {/* <div className="col-12">{JSON.stringify(inputs)}</div> */}
                                        <div class="col-sm-6 mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">Leave</label>
                                            <select required className="form-control" name="leaveType" aria-label="Floating label select example"
                                                onChange={changeHandler}
                                                value={inputs.leaveType || ""}
                                            >
                                                <option value={1}>Annual Leave</option>
                                                <option value={2}>Medical Leave</option>
                                                <option value={3}>Emergency Leave</option>
                                                <option value={4}>Covid Positive Leave</option>
                                                <option value={5}>Maternity Leave</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-6 mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Begin Date</label>
                                            <input
                                                required
                                                name="beginDate"
                                                onChange={changeHandler}
                                                value={inputs.beginDate || ""}
                                                type="date" class="form-control" id="exampleFormControlInput1" />
                                        </div>
                                    </div>
                                    <div class="row g-3">
                                        <div class="col-sm-6 mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">End date</label>
                                            <input
                                                required
                                                name="endDate"
                                                onChange={changeHandler}
                                                value={inputs.endDate || ""}
                                                type="date" class="form-control" id="exampleFormControlInput1" />
                                        </div>
                                        <div class="col-sm-6 mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Total Day</label>
                                            <input
                                                readOnly
                                                name="totalDays"
                                                onChange={changeHandler}
                                                value={dayDiff}
                                                type="text" class="form-control" id="exampleFormControlInput1" />
                                        </div>
                                    </div>
                                    <div class="row g-3">
                                        <div class="col-sm-6 mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">Reason</label>
                                            <textarea
                                                required
                                                name="reason"
                                                onChange={changeHandler}
                                                value={inputs.reason || ""}
                                                className='form-control' />
                                        </div>
                                        <div class="col-sm-6 mb-3">
                                            <label for="exampleFormControlTextarea1" class="form-label">Attached Document</label>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                className="form-control"
                                                onChange={onFileChange}
                                                accept=".jpg,.jpeg,.png,.pdf"
                                            />
                                        </div>
                                    </div>

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setLgShow(false)}>
                                        Close
                                    </Button>
                                    <button type="submit" className="btn btn-primary" onClick={{}}>
                                        Save Changes
                                    </button>
                                </Modal.Footer>
                            </form>
                        </Modal>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div class="bg-light rounded d-flex align-items-center justify-content-between p-4">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Leave Type</th>
                                            <th>Begin Date</th>
                                            <th>End Date</th>
                                            <th>Total Days</th>
                                            <th>Reason</th>
                                            <th>Attached Document</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leavesList.map((item, index) => {

                                            let date = new Date(item.beginDate);
                                            console.log(item._id, date);
                                            let offset = 8;
                                            date = new Date(date.getTime() + offset * 60 * 60 * 1000);
                                            let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ').substring(0, 10);

                                            let date2 = new Date(item.endDate);
                                            let offset2 = 8;
                                            date2 = new Date(date2.getTime() + offset2 * 60 * 60 * 1000);
                                            let formattedDate2 = date2.toISOString().slice(0, 19).replace('T', ' ').substring(0, 10);

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.leaveType}</td>
                                                    <td>{formattedDate}</td>
                                                    <td>{formattedDate2}</td>
                                                    <td>{item.totalDays}</td>
                                                    <td>{item.reason}</td>
                                                    <td> <a href={`http://localhost:5010/view/${item.attachedDocument}`} target="_blank">{item.attachedDocument}</a></td>
                                                    <td>
                                                        {item.status == "PENDING" ? <span className="badge bg-warning">{item.status}</span>
                                                            : item.status == "APPROVED" ? <span className="badge bg-success">{item.status}</span>
                                                                : item.status == "DECLINED" ? <span className="badge bg-danger">{item.status}</span>
                                                                    : null}
                                                    </td>
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

export default Leave