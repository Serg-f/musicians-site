// src/components/Navbar.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import { AuthContext } from '../context/AuthContext';

const MyNavbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    console.log('isAuthenticated:', isAuthenticated);
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/">
                    <img src={logo} height="30" className="d-inline-block align-top" alt="Logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink to="/" className="nav-link mx-2">Musicians</NavLink>
                        <NavLink to="/article/add" className="nav-link mx-2">Create Article</NavLink>
                        <NavLink to="/contact" className="nav-link mx-2">Contact Us</NavLink>
                        <NavLink to="/about" className="nav-link mx-2">About</NavLink>
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <NavDropdown title={<><i className="fas fa-user-circle"></i> Welcome, {user?.username}</>} id="collasible-nav-dropdown" className="mx-2">
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
