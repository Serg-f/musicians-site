import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import BaseLayout from "./BaseLayout";

const About = () => {
    return (
        <BaseLayout>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Row className="w-100">
                    <Col md={6} className="mx-auto">
                        <h2>About This Project</h2>
                        <p className="mt-4">
                            For source code and detailed description visit the GitHub repository:
                        </p>
                        <Button
                            variant="primary"
                            href="https://github.com/Serg-f/musicians-site"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub Repository
                        </Button>
                    </Col>
                </Row>
            </Container>
        </BaseLayout>
    );
}

export default About;
