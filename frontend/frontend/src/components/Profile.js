// src/components/Profile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { axiosInstance } from '../context/axiosInstances';
import BaseLayout from './BaseLayout';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/profile/');
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <BaseLayout>
            <Container className="mt-5">
                <Card>
                    <Card.Header as="h5">{profile.username}'s Profile</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Last Login:</strong> {new Date(profile.last_login).toLocaleString()}</p>
                                <p><strong>Joined:</strong> {new Date(profile.date_joined).toLocaleString()}</p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Published Articles:</strong> {profile.articles_published}</p>
                                <p><strong>Total Articles:</strong> {profile.articles_total}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </BaseLayout>
    );
};

export default Profile;
