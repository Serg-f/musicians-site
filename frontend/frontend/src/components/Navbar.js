// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import { verifyToken, refreshToken, getUserProfile } from '../utils/auth';

const MyNavbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            let isValid = await verifyToken();
            if (!isValid) {
                isValid = await refreshToken();
            }
            if (isValid) {
                const profile = await getUserProfile();
                setUserName(profile ? profile.username : 'User');
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/">
                    <img src={logo} height="30" className="d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink to="/" className="nav-link mx-2">Musicians</NavLink> {/* Use NavLink instead of Nav.Link */}
                        <NavLink to="/article/add" className="nav-link mx-2">Create Article</NavLink> {/* Use NavLink instead of Nav.Link */}
                        <NavLink to="/contact" className="nav-link mx-2">Contact Us</NavLink> {/* Use NavLink instead of Nav.Link */}
                        <NavLink to="/about" className="nav-link mx-2">About</NavLink> {/* Use NavLink instead of Nav.Link */}
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <NavDropdown title={<><i className="fas fa-user-circle"></i> Welcome, {userName}</>} id="collasible-nav-dropdown" className="mx-2">
                                <NavDropdown.Item as={NavLink} to="/profile">My Profile</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/articles_author">My Articles</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Sign out</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="sign-in-link mx-2"><i className="fas fa-sign-in-alt"></i> Sign In</Nav.Link>
                                <Button as={NavLink} to="/signup" className="btn-sign-up mx-2">Sign Up</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
