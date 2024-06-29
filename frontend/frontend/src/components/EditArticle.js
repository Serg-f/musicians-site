// src/components/EditArticle.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import BaseLayout from './BaseLayout';

const EditArticle = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [style, setStyle] = useState('');
    const [styles, setStyles] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/styles/');
                setStyles(response.data);
            } catch (err) {
                console.error('Error fetching styles:', err);
            }
        };

        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/author/musicians/${id}/`);
                const article = response.data;
                setTitle(article.title);
                setContent(article.content);
                setStyle(article.style);
                setPhoto(article.photo);
                setVideo(article.video);
                setIsPublished(article.is_published);
            } catch (err) {
                console.error('Error fetching article:', err);
            }
        };

        fetchStyles();
        fetchArticle();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('style', style);
        if (photo) formData.append('photo', photo);
        formData.append('video', video);
        formData.append('is_published', isPublished);

        try {
            await axios.put(`http://localhost:8000/v1/author/musicians/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/articles/${id}`);
        } catch (err) {
            if (err.response && err.response.data) {
                setFieldErrors(err.response.data);
            } else {
                setError('Error updating article. Please try again.');
            }
        }
    };

    return (
        <BaseLayout>
            <Container className="mt-4">
                <Row>
                    <Col>
                        <h1>Edit Article</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                {fieldErrors.title && (
                                    <Alert variant="danger">
                                        {fieldErrors.title.join(' ')}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group controlId="content" className="mb-3">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                                {fieldErrors.content && (
                                    <Alert variant="danger">
                                        {fieldErrors.content.join(' ')}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group controlId="style" className="mb-3">
                                <Form.Label>Style</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    required
                                >
                                    <option value="">Select a style</option>
                                    {styles.map((style) => (
                                        <option key={style.id} value={style.url}>
                                            {style.name}
                                        </option>
                                    ))}
                                </Form.Control>
                                {fieldErrors.style && (
                                    <Alert variant="danger">
                                        {fieldErrors.style.join(' ')}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group controlId="photo" className="mb-3">
                                <Form.Label>Photo</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                />
                                {fieldErrors.photo && (
                                    <Alert variant="danger">
                                        {fieldErrors.photo.join(' ')}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group controlId="video" className="mb-3">
                                <Form.Label>Video URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    value={video}
                                    onChange={(e) => setVideo(e.target.value)}
                                />
                                {fieldErrors.video && (
                                    <Alert variant="danger">
                                        {fieldErrors.video.join(' ')}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Form.Group controlId="isPublished" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Publish"
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Update Article
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </BaseLayout>
    );
};

export default EditArticle;
