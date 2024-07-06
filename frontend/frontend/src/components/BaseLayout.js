// src/components/BaseLayout.js
import React from 'react';
import { Container } from 'react-bootstrap';
import Footer from './Footer';
import MyNavbar from './Navbar';

const BaseLayout = ({ children }) => {

    return (
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <MyNavbar />
            <Container fluid className="container flex-grow-1 mt-2 mt-md-4">
                {children}
            </Container>
            <Footer />
        </div>
    );
};

export default BaseLayout;
