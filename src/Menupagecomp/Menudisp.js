import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdAdd } from "react-icons/io";
// Function to fetch user data from localStorage
const getUserData = async () => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
        return JSON.parse(storedData);
    }
    throw new Error("No user data found");
};





// Function to create a new menu in the database


const Menudisp = () => {


    const { userId } = useParams();  // Get the userId from the URL

    // Query to fetch user data
    const { data: maindata, error, isLoading } = useQuery({
        queryKey: ['userData'], // Query key
        queryFn: getUserData,  // Function to fetch data
    });

    const queryClient = useQueryClient(); // To manually invalidate and refetch the query

    const [menuVisible, setMenuVisible] = useState(false); // Toggle input field visibility
    const [newName, setNewName] = useState(''); // Store current input value
    const [checkedItems, setCheckedItems] = useState({}); // Track which menu items are checked
    const navigate = useNavigate();
    // Load checked items from localStorage when the component mounts
    useEffect(() => {
        const storedCheckedItems = localStorage.getItem('checkedItems');
        if (storedCheckedItems) {
            setCheckedItems(JSON.parse(storedCheckedItems)); // Parse and load stored checked items
        }
    }, []);


    const createMenuInDB = async (newName) => {
        try {
            const response = await axios.post('http://localhost:3000/usergroup/groupcreate', {
                name: newName,  // Sending the name as part of the request body
                userId: userId
            });

            return response.data;  // Return the response data from the API
        } catch (error) {
            console.error('Error creating menu:', error);
            throw new Error('Failed to create menu');
        }
    };

    // Mutation to handle creating a new menu
    const mutation = useMutation({
        mutationFn: createMenuInDB,  // API call to store the menu in the DB
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menulist'] }); // Invalidate menu list query
        },
    });


    // Function to fetch all menus
    const Getallfetch = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/usergroup/getmenubyid/${userId}`);
            console.log("Fetched Data from API:", response.data); // Debugging
            return response.data; // Ensure this is an array
        } catch (error) {
            console.error("API Error:", error);
            throw new Error('Failed to fetch menu data');
        }
    };



    // Query to fetch all menus
    const { data: menuData, error: menuError, isLoading: menuLoading } = useQuery({
        queryKey: ['menulist', userId], // Key to identify the query
        queryFn: Getallfetch,  // Function to fetch menu data
    });


    const createmenu = () => {
        setMenuVisible((prev) => !prev); // Toggle visibility of the input form
    };

    const handleAddName = () => {
        if (newName.trim() !== '') {
            mutation.mutate(newName);  // Trigger the mutation to create the menu in DB
            setNewName(''); // Clear the input field
            setMenuVisible(false); // Hide the input field after adding
        }
    };

    const handleCheckboxChange = (name) => {
        // Toggle the checked state for this name
        const updatedCheckedItems = { ...checkedItems, [name]: !checkedItems[name] };
        setCheckedItems(updatedCheckedItems);

        // Save the updated checked items to localStorage
        localStorage.setItem('checkedItems', JSON.stringify(updatedCheckedItems));
    };

    const handleItemClick = (userId, groupId) => {
        navigate(`/todo/${userId}/${groupId}`); // Navigate to a specific route
    };

    const logout = () => {
        localStorage.clear();
        navigate('/')
        console.log("All localStorage cleared. User logged out.");
    };

    if (menuError) {
        return <p>Error...</p>;
    }

    if (menuLoading) {
        return <p>Data is loading...</p>;
    }

    console.log(menuData.data);


    return (
        <Container fluid style={{ height: '100vh', padding: '20px' }}>
            {/* Header Row */}
            <Row className="mb-4 align-items-center">
                <Col xs={12} lg={4} className="text-center text-lg-start">
                    <h4>TodoGroups</h4>
                </Col>
                <Col xs={12} lg={6}></Col>
                <Col xs={12} lg={2} className="text-center text-lg-end">
                    <h4>
                        Welcome{' '}
                        {isLoading ? (
                            'Loading...'
                        ) : error ? (
                            'No name available'
                        ) : (
                            `${maindata?.name || 'Guest'}!`
                        )}
                    </h4>
                </Col>
            </Row>

            {/* Main Content */}
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={8}>
                    <Card className="shadow-sm p-4 card-col">
                        {/* Add Menu Section */}
                        <IoMdAdd
                            onClick={createmenu}
                            style={{ cursor: 'pointer', color: 'white' }}
                            className="text-center"
                        />

                        {menuVisible && (
                            <div className="mt-3">
                                <Form.Control
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter a Menu"
                                    className="mb-3 inputforsign"
                                />
                                <button
                                    variant="primary"
                                    onClick={handleAddName}
                                    disabled={mutation.isLoading}
                                    className="w-100 login-button"
                                >
                                    {mutation.isLoading ? 'Adding...' : 'Add Menu'}
                                </button>
                            </div>
                        )}

                        {/* Created Groups Section */}
                        <div className="mt-4">
                            <h5>Created Groups:</h5>
                            <ul className="list-unstyled mt-3">
                                {menuData?.data &&
                                    menuData?.data.map((menu, index) => (
                                        <li
                                            key={menu.id || index}
                                            className="d-flex align-items-center mb-2"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checkedItems[menu.name] || false}
                                                onChange={() => handleCheckboxChange(menu.name)}
                                                className="me-2"
                                            />
                                            <span
                                                onClick={() => handleItemClick(menu.createdBy, menu._id)}
                                                style={{
                                                    textDecoration: checkedItems[menu.name]
                                                        ? 'line-through'
                                                        : 'none',
                                                }}
                                            >
                                                {menu.name}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} md={8} lg={4}>
                    <button className='login-button' onClick={logout}>Logout</button>
                </Col>
            </Row>
        </Container>
    );
};

export default Menudisp;
