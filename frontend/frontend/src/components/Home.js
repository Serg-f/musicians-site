import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {Row, Col, Button, Form} from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import StylesFilter from "./StylesFilter";
import CustomPagination from './Pagination'; // Import the custom pagination component
import {AuthContext} from '../context/AuthContext';
import {useSearchParams} from 'react-router-dom';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const {user, isAuthenticated, verifyAuth} = useContext(AuthContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const articlesPerPage = parseInt(searchParams.get('articlesPerPage') || '3');

    useEffect(() => {
        verifyAuth();

        const fetchArticles = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/musicians/?page=${page}&page_size=${articlesPerPage}`);
                const {results, count, next} = response.data;

                const articlesWithDetails = await Promise.all(results.map(async (article) => {
                    const styleResponse = await axios.get(article.style);
                    let authorName = 'Unknown';
                    try {
                        const authorResponse = await axios.get(`http://localhost:8020/users/${article.author_id}/`);
                        authorName = authorResponse.data.username;
                    } catch (error) {
                        console.error('Error fetching author details:', error);
                    }
                    return {
                        ...article,
                        styleName: styleResponse.data.name,
                        authorName
                    };
                }));
                setArticles(articlesWithDetails);

                const totalPages = next ? Math.ceil(count / articlesPerPage) : page;
                setPageCount(totalPages);

            } catch (error) {
                console.error('There was an error fetching the articles!', error);
            }
        };

        fetchArticles();
    }, [page, articlesPerPage, verifyAuth]);

    const handlePageChange = (newPage) => {
        setSearchParams({page: newPage, articlesPerPage});
    };

    const handleArticlesPerPageChange = (e) => {
        setSearchParams({page: 1, articlesPerPage: e.target.value});
    };

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
                                        <p className="text-muted">Style: {article.styleName}</p>
                                        <p className="text-muted">Author: {article.authorName}</p>
                                        <p className="text-muted">Created: {new Date(article.time_create).toLocaleString()}</p>
                                        <h5 className="mt-2">{article.title}</h5>
                                        <p>{article.content.substring(0, 300)}...</p>
                                        <div className="d-flex">
                                            <Button variant="primary" href={`/articles/${article.id}`}>Read
                                                article</Button>
                                            {isAuthenticated && user?.id === article.author_id && (
                                                <>
                                                    <Button variant="secondary"
                                                            href={`/articles/edit/${article.id}`}
                                                            style={{margin: '0 5px'}}>Edit</Button>
                                                    <Button variant="danger"
                                                            href={`/articles/delete/${article.id}`}>Delete</Button>
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

                    <Row className="mb-3">
                        <Col md="auto" id="1">
                            <CustomPagination
                                currentPage={page}
                                totalPages={pageCount}
                                onPageChange={handlePageChange}
                            />
                        </Col>
                        <Col md="auto" id="2" className="ml-md-auto">
                            <Form.Group as={Row} className="flex-nowrap">
                                <Form.Label column sm="auto">Articles per page</Form.Label>
                                <Col sm="auto">
                                    <Form.Control
                                        as="select"
                                        value={articlesPerPage}
                                        onChange={handleArticlesPerPageChange}
                                    >
                                        <option value={3}>3</option>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </BaseLayout>
    );
}

export default Home;
