import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import StylesFilter from "./StylesFilter";
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const { user, isAuthenticated, verifyAuth } = useContext(AuthContext);

    useEffect(() => {
        verifyAuth();

        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/musicians/');
                const articlesWithDetails = await Promise.all(response.data.map(async (article) => {
                    const styleResponse = await axios.get(article.style);
                    const authorResponse = await axios.get(`http://localhost:8020/users/${article.author_id}/`);
                    return {
                        ...article,
                        styleName: styleResponse.data.name,
                        authorName: authorResponse.data.username
                    };
                }));
                setArticles(articlesWithDetails);
            } catch (error) {
                console.error('There was an error fetching the articles!', error);
            }
        };

        fetchArticles();
    }, [verifyAuth]);

    return (
        <BaseLayout>
            <Row>
                <Col lg={3}>
                    <StylesFilter
                        selectedStyles={selectedStyles}
                        onStyleChange={setSelectedStyles}
                    />
                </Col>
                <Col lg={9} className="mobile-content">
                    <Row>
                        {articles.length > 0 ? articles.map(article => (
                            <Col key={article.id} lg={12} className="mb-4">
                                <Row className="p-3 border-bottom">
                                    {article.photo && (
                                        <Col md="auto" className="mb-3 mb-md-0">
                                            <img src={article.photo} alt={article.title} className="img-fluid"
                                                style={{ maxWidth: '300px', width: '100%', height: 'auto' }} />
                                        </Col>
                                    )}
                                    <Col>
                                        <p className="text-muted">Style: {article.styleName}</p>
                                        <p className="text-muted">Author: {article.authorName}</p>
                                        <p className="text-muted">Created: {new Date(article.time_create).toLocaleString()}</p>
                                        <h5 className="mt-2">{article.title}</h5>
                                        <p>{article.content.substring(0, 300)}...</p>
                                        <div className="d-flex">
                                            <Button variant="primary" href={`/articles/${article.id}`}>Read article</Button>
                                            {isAuthenticated && user?.id === article.author_id && (
                                                <>
                                                    <Button variant="secondary"
                                                        href={`/articles/edit/${article.id}`}
                                                        style={{ margin: '0 5px' }}>Edit</Button>
                                                    <Button variant="danger" href={`/articles/delete/${article.id}`}>Delete</Button>
                                                </>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        )) : (
                            <Col>
                                <div className="text-center p-5">
                                    <p className="text-muted">No articles available.</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </BaseLayout>
    );
}

export default Home;
