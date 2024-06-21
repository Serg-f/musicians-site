// src/components/Home.js
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Row, Col, Button} from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import StylesFilter from "./StylesFilter";

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);

    useEffect(() => {
        // Fetch articles from API
        axios.get('http://localhost:8000/v1/musicians/')
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the articles!', error);
            });
    }, []);

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
                                                     style={{maxWidth: '300px', width: '100%', height: 'auto'}}/>
                                            </Col>
                                        )}
                                        <Col>
                                            <p className="text-muted">Style: {article.style}</p>
                                            <p className="text-muted">Date: {new Date(article.time_create).toLocaleString()}</p>
                                            <p className="text-muted">Author: {article.author}</p>
                                            <h5 className="mt-2">{article.title}</h5>
                                            <p>{article.content.substring(0, 300)}...</p>
                                            <div className="d-flex">
                                                <Button variant="primary" href={`/articles/${article.id}`}>Read
                                                    article</Button>
                                                {( // Replace true with your condition to check user
                                                    <>
                                                        <Button variant="secondary"
                                                                href={`/articles/edit/${article.id}`}
                                                                style={{margin: '0 5px'}}>Edit</Button>
                                                        <Button variant="danger" href={`/articles/delete/${article.id}`}
                                                        >Delete</Button>
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
