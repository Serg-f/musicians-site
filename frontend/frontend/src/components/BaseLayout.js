// src/components/BaseLayout.js
import React, {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import StylesFilter from './StylesFilter';
import Footer from './Footer';
import {Form, Button, ListGroup} from 'react-bootstrap';
import MyNavbar from "./Navbar";

const BaseLayout = ({children}) => {
    const [selectedStyles, setSelectedStyles] = useState([]);
    return (
        <div className="d-flex flex-column" style={{minHeight: "100vh"}}>
            <MyNavbar/>

            <Container fluid className="container flex-grow-1 mt-2 mt-md-5">
                <Row>
                    <Col lg={3}>
                        <StylesFilter
                            selectedStyles={selectedStyles}
                            onStyleChange={setSelectedStyles}
                        />
                    </Col>
                    <Col lg={9} className="mobile-content">
                        {children}
                    </Col>
                </Row>
            </Container>

            <Footer/>
        </div>
    );
};

export default BaseLayout;