import React, { useState } from 'react';
import { Button, Card, Col, Container, FormControl, Row } from 'react-bootstrap';
import '../Login/Login.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Loginpage = () => {
    const [inputget, setInputget] = useState({
        email_address: '',
        password: ''
    });
    const [validemail, setValidemail] = useState();
    const [validpassword, setValidpassword] = useState();
    const [addph, setAddph] = useState(false);
    const navv = useNavigate();
    
    let eemail = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,4}$/;
    let ppassword = /^[a-zA-z0-9]{6}$/;

    const handlechange = (e) => {
        const { name, value } = e.target; // Get name and value from the event target
        setInputget((prev) => ({
            ...prev, // Spread the previous state
            [name]: value, // Dynamically update the field using the name attribute
        }));
        switch (name) {
            case "email":
                setValidemail("");
                break;
            case "password":
                setValidpassword("");
                break;
            default:
                break;
        }
    };

    const handlesignin = () => {
        navv('/signin');
    };

    const handleClick = async (e) => {
        e.preventDefault();
        let hasErrors = false;

        // Validate email
        if (inputget.email_address === "") {
            if (!validemail) setValidemail("Email is required");
            hasErrors = true;
        } else if (!eemail.test(inputget.email_address)) {
            if (!validemail) setValidemail("Invalid email");
            hasErrors = true;
        } else if (validemail) {
            setValidemail(""); // Clear previous error
        }

        // Validate password
        if (!inputget.password) {
            if (!validpassword) setValidpassword("Password is required");
            hasErrors = true;
        } else if (!ppassword.test(inputget.password)) {
            if (!validpassword) setValidpassword("Invalid password");
            hasErrors = true;
        } else if (validpassword) {
            setValidpassword(""); // Clear previous error
        }

        if (!hasErrors) {
            setAddph(true);
        }

        // Submit the form only if no errors
        if (!hasErrors) {
            try {
                const response = await axios.post('http://localhost:3000/userapi/login', inputget);
                if (response.status === 200) {
                    const userId = response.data.todouser._id;  // Assuming `user_id` is part of the response

                    // Store user data in localStorage
                    localStorage.setItem('userData', JSON.stringify(response.data.todouser));

                    Swal.fire({
                        title: "Good job!",
                        text: "User has been successfully logged in!",
                        icon: "success",
                    });

                    // Navigate to the Menudisp page and pass user_id as a URL parameter
                    navv(`/Menudisp/${userId}`,{ 
                        replace: true });  // Pass userId as a URL parameter
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
        }
    };

    return (
        <Container style={{ height: '100vh' }}>
            <Row>
                <Col xs={12} sm={12} md={4} lg={3} xl={3} >
                </Col>
                <Col xs={12} sm={12} md={4} lg={7} xl={7} >
                    <Card className='card-style'>
                        {!addph && (
                            <>
                                <label style={{ marginBottom: '10px' }}>Email address</label>
                                <FormControl
                                    className='input-field'
                                    style={{ marginBottom: '10px' }}
                                    type='text'
                                    name='email_address'
                                    value={inputget.email_address}
                                    onChange={handlechange}>
                                </FormControl>
                                <p style={{ color: "red" }} className="p1">
                                    {validemail}{" "}
                                </p>
                                <label style={{ marginBottom: '10px' }} >Password</label>
                                <FormControl
                                   className='input-field'
                                    style={{ marginBottom: '20px' }}
                                    type='password'
                                    name='password'
                                    value={inputget.password}
                                    onChange={handlechange}>
                                </FormControl>
                                <p style={{ color: "red" }} className="p1">
                                    {validpassword}{" "}
                                </p>
                                <div className='login-div'>
                                <button  className='login-button'onClick={handleClick} >Login</button>
                                </div>
                                
                            </>
                        )}
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={4} lg={2} xl={2} >
                    <button 
                    className='sign-in'
                    onClick={handlesignin}>Sign in</button>
                </Col>
            </Row>
        </Container>
    )
}

export default Loginpage;
