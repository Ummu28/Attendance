import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [redirect, setRedirect] = useState(false);
    const [redirect2, setRedirect2] = useState(false);

    const validation = () => {
        if (email == "admin@gmail.com") {
            if (email == "admin@gmail.com" && password == "admin123") {
                sessionStorage.setItem("session_id", "admin@gmail.com");
                setRedirect(true)
            }
        } else {
            axios.post("http://localhost:5010/api/login", { email, password })
                .then(data => {
                    if (data.data.error) {
                        alert(data.data.error)
                    } else {
                        // alert(JSON.stringify(data.data))
                        sessionStorage.setItem("session_id", data.data._id);
                        sessionStorage.setItem("session_fullname", data.data.fullname);
                        sessionStorage.setItem("session_all", data.data);
                        setRedirect2(true)
                    }
                })
        }
    }


    if (redirect == true) {
        // return <Navigate replace to="/login" />;
        // window.location.href = "/edit-student/1";
        return <Navigate replace to="/adminIndex" />;
    }

    if (redirect2 == true) {
        // return <Navigate replace to="/login" />;
        // window.location.href = "/edit-student/1";
        return <Navigate replace to="/dashboard" />;
    }

    return (
        <div class="container-fluid position-relative bg-white d-flex p-0">
            <div class="container-fluid">
                <div class="row h-100 align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                    <div class="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                        <div class="bg-light rounded p-4 p-sm-5 my-4 mx-3">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <a href="index.html" class="">
                                    <h3 class="text-primary"><i class="fa fa-hashtag me-2"></i>WORKXY</h3>
                                </a>
                                <h3>Sign In</h3>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                                <label for="floatingInput">Email address</label>
                            </div>
                            <div class="form-floating mb-4">
                                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                <label for="floatingPassword">Password</label>
                            </div>
                            <button type="submit" class="btn btn-primary py-3 w-100 mb-4" onClick={() => validation()}>Login</button>
                            <p class="text-center mb-0">Cannot access? Please contact your person in charge</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;