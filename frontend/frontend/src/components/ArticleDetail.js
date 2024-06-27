// src/components/ArticleDetail.js
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Button } from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import ReactPlayer from 'react-player';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const CACHE_KEY = 'stylesCache';
    const USERS_CACHE_KEY = 'usersCache';

    const fetchArticle = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/v1/musicians/${id}/`);
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchArticle();
    }, [fetchArticle]);

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

    if (!article) {
        return <div>Loading...</div>;
    }

    const styleName = getStyleName(article.style);
    const authorName = getAuthorName(article.author_id);

    return (
        <BaseLayout>
            <Container className="mt-4">
                <h1>{article.title}</h1>
                <Row>
                    <Col lg={8}>
                        {article.photo && (
                            <img src={article.photo} className="img-fluid mb-3" alt={article.title}/>
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
                                    onClick={() => navigate(`/articles/edit/${article.id}`)}
                                    className="me-2"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => navigate(`/articles/delete/${article.id}`)}
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </BaseLayout>
    );
};

export default ArticleDetail;
