import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Button, Modal, CloseButton } from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import ReactPlayer from 'react-player';
import { axiosInstance, axiosInstanceNoAuth } from '../context/axiosInstances'; // Import axios instances
import { musiciansServiceURL } from '../context/serviceUrls';

const ArticleDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [article, setArticle] = useState(null);
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const CACHE_KEY = 'stylesCache';
    const USERS_CACHE_KEY = 'usersCache';
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchArticle = useCallback(async () => {
        if (loading) return;

        try {
            const fromUserArticles = location.state?.fromUserArticles;
            const url = fromUserArticles
                ? `${musiciansServiceURL}/v1/author/musicians/${id}/`
                : `${musiciansServiceURL}/v1/musicians/${id}/`;

            const axiosClient = fromUserArticles ? axiosInstance : axiosInstanceNoAuth;

            const response = await axiosClient.get(url);
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
        }
    }, [id, location.state, loading]);

    useEffect(() => {
        if (!loading) {
            fetchArticle();
        }
    }, [fetchArticle, loading]);

    const getCachedData = (key) => {
        const cachedData = localStorage.getItem(key);
        return cachedData ? JSON.parse(cachedData) : null;
    };

    const getStyleName = (styleUrl) => {
        const styles = getCachedData(CACHE_KEY) || [];
        const styleId = parseInt(styleUrl.split('/').slice(-2, -1)[0]);
        const style = styles.find(s => s.id === styleId);
        return style ? style.name : 'Unknown';
    };

    const getAuthorName = (authorId) => {
        const users = getCachedData(USERS_CACHE_KEY) || [];
        const author = users.find(u => u.id === authorId);
        return author ? author.username : 'Unknown';
    };

    if (loading || !article) {
        return <div>Loading...</div>;
    }

    const styleName = getStyleName(article.style);
    const authorName = getAuthorName(article.author_id);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`${musiciansServiceURL}/v1/author/musicians/${id}/`);
            navigate('/');
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    return (
        <BaseLayout>
            <Container className="mt-4 mb-4">
                <h1>{article.title}</h1>
                <Row>
                    <Col lg={8}>
                        {article.photo && (
                            <img src={article.photo} className="img-fluid mb-3" alt={article.title} />
                        )}
                    </Col>
                    <Col lg={4}>
                        <p className="text-muted">
                            Style: <Button
                            variant="link"
                            className="text-decoration-underline text-primary p-0"
                            onClick={() => navigate(`/styles/${styleName}`)}>{styleName}</Button>
                        </p>
                        <p className="text-muted">
                            Author: <Button
                            variant="link"
                            className="text-decoration-underline text-primary p-0"
                            onClick={() => navigate(`/authors/${authorName}`)}>{authorName}</Button>
                        </p>
                        <p className="text-muted">Created: {new Date(article.time_create).toLocaleString()}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="article-content mb-4">
                            {article.content.split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                        {article.video && (
                            <div className="embed-responsive embed-responsive-16by9 mb-4">
                                <ReactPlayer
                                    url={article.video}
                                    className="react-player"
                                    width="100%"
                                    height="100%"
                                    controls
                                />
                            </div>
                        )}
                        {isAuthenticated && user.id === article.author_id && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/article/edit/${article.id}`)}
                                    className="mr-2"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                    <CloseButton onClick={() => setShowConfirm(false)} />
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this article?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </BaseLayout>
    );
};

export default ArticleDetail;
