import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Signin = () => {
    const [data, setData] = useState({
        name: "",
        email_address: "",
        age: "",
        gender: "",
        phone_number: '',
        password: ""
    });
    const [addph, setAddph] = useState(false);
    let [validname, setValidname] = useState();
    let [validemail, setValidEmail] = useState();
    let [validage, setValidage] = useState();
    let [validgender, setValidgender] = useState();
    let [validpassword, setValidpassword] = useState();

    let eemail = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,4}$/;
    let passwordcheck = /^[a-zA-z0-9]{6}$/;


    const nav2 = useNavigate();

    const HandleChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        switch (name) {
            case "name":
                setValidname("");
                break;
            case "email_address":
                setValidEmail("");
                break;
            case "age":
                setValidage("");
                break;
            case "password":
                setValidpassword("");
                break;
            default:
                break;
        }
    };





    const Handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/userapi/create', data);
            if (response.status === 200) {
                Swal.fire({
                    title: "Good job!",
                    text: "User has been successfully added!",
                    icon: "success",
                });
                nav2("/");
            } else {
                Swal.fire({
                    title: "Oops!",
                    text: "Something went wrong!",
                    icon: "error",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Oops!",
                text: "An error occurred. Please try again later.",
                icon: "error",
            });
        }
        let hasErrors = false;

        if (!data.user_name) {
            setValidname("Name is required");
            hasErrors = true;
        } else {
            setValidname("");
        }

        if (data.email_address === "") {
            setValidEmail("Email is required");
            hasErrors = true;
        } else if (!eemail.test(data.email)) {
            setValidEmail("Invalid email");
            hasErrors = true;
        } else {
            setValidEmail("");
        }

        if (!data.age) {
            setValidage("Date of birth is required");
            hasErrors = true;
        } else {
            setValidage("");
        }

        if (!data.password) {
            setValidpassword("Password is required");
            hasErrors = true;
        } else if (!passwordcheck.test(data.password)) {
            setValidpassword("Invalid password");
            hasErrors = true;
        } else {
            setValidpassword("");
        }
        if (!hasErrors) {
            setAddph(true);
        }
    };



    const Loginbut = () => {
        nav2('/');
    }
    return (
        <Container fluid style={{ height: "100vh" }}>
            {/* Header Row */}
            <Row style={{ height: "5vh" }} className="align-items-center">
                <Col xs={8} md={6} lg={7} xl={7}>
                    <p
                        className="m-3 animated-todo"
                        style={{ fontSize: "40px", color: 'black' }}
                    >
                        Todo
                    </p>
                </Col>
                <Col xs={4} md={6} lg={5} xl={5} className="d-flex justify-content-end">
                    <button onClick={Loginbut} className='login-but' style={{ width: '100%', maxWidth: '100px' }}>
                        Login
                    </button>
                </Col>
            </Row>

            {/* Main Content Row */}
            <Row style={{ height: "95vh" }} className="align-items-center">
                {/* Left Spacer Column */}
                <Col xs={12} md={4} lg={4} className="d-none d-md-block"></Col>

                {/* Center Column with Card */}
                <Col xs={12} md={5} lg={4}>
                    <Card className="p-4 shadow card-col">
                        <h2 style={{ color: 'black' }} className="text-center mb-4">
                            CREATE YOUR ACCOUNT!
                        </h2>
                        <form onSubmit={Handlesubmit}>
                            {!addph && (
                                <>
                                    {/* Name Field */}
                                    <div className="mb-3">
                                        <label style={{ color: 'black' }}>Name:</label>
                                        <input
                                            type="text"
                                            id="user_name"
                                            name="name"
                                            value={data.Name}
                                            className="form-control inputforsign"
                                            placeholder="Enter your name"
                                            onChange={HandleChange}
                                        />
                                        <p style={{ color: "red" }}>{validname}</p>
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <label htmlFor="email" style={{ color: 'black' }} className="form-label">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email_address"
                                            value={data.email_address}
                                            className="form-control inputforsign"
                                            placeholder="Enter your email"
                                            onChange={HandleChange}
                                        />
                                        <p style={{ color: "red" }}>{validemail}</p>
                                    </div>

                                    {/* Age and Gender Row */}
                                    <Row className="mb-3">
                                        <Col>
                                            <label style={{ color: 'black' }} htmlFor="dob" className="form-label">
                                                Age:
                                            </label>
                                            <input
                                                type="date"
                                                id="age"
                                                name="age"
                                                value={data.age}
                                                className="form-control inputforsign"
                                                onChange={HandleChange}
                                            />
                                            <p style={{ color: "red" }}>{validage}</p>
                                        </Col>
                                        <Col>
                                            <label style={{ color: 'black' }} htmlFor="gender" className="form-label">
                                                Gender:
                                            </label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={data.gender}
                                                className="form-control inputforsign"
                                                onChange={HandleChange}
                                            >
                                                <option value="" disabled hidden>
                                                    Select Gender
                                                </option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="others">Others</option>
                                            </select>
                                        </Col>
                                    </Row>

                                    {/* Phone Number */}
                                    <div className="mb-3">
                                        <label style={{ color: 'black' }}>Phone Number:</label>
                                        <input
                                            type="text"
                                            id="phonenumber"
                                            value={data.phone_number}
                                            name="phone_number"
                                            className="form-control inputforsign"
                                            placeholder="Enter phone number"
                                            onChange={HandleChange}
                                            minLength={10}
                                            maxLength={10}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <label style={{ color: 'black' }} htmlFor="password" className="form-label">
                                            Password:
                                        </label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            placeholder="*****"
                                            onChange={HandleChange}
                                            className='inputforsign'
                                            required
                                        />
                                        <p style={{ color: "red" }}>{validpassword}</p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mb-3 d-flex justify-content-center">
                                        <button className="signup-but" onClick={Handlesubmit}>
                                            Sign up
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </Card>
                </Col>

                {/* Right Spacer Column */}
                <Col xs={12} md={3} lg={4} className="d-none d-md-block"></Col>
            </Row>
        </Container>


    );
};

export default Signin
