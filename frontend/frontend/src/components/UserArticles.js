// src/components/UserArticles.js

import React, {useEffect, useState, useContext, useCallback, useMemo} from 'react';
import {axiosInstance} from '../context/axiosInstances';
import {Row, Col, Button, Modal, CloseButton} from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import BaseUserArticlesFilter from './filters/BaseUserArticlesFilter';
import CustomPagination from './Pagination';
import {AuthContext} from '../context/AuthContext';
import {useSearchParams, useNavigate, Link} from 'react-router-dom';
import Search from './Search';
import {musiciansServiceURL, usersServiceURL} from '../context/serviceUrls';

const UserArticles = () => {
    const [articles, setArticles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [styles, setStyles] = useState([]);
    const {user, isAuthenticated} = useContext(AuthContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState('time-create-desc');
    const [selectedPublishing, setSelectedPublishing] = useState('all');

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page-size') || '3');
    const searchTerm = searchParams.get('search') || '';
    const orderParam = searchParams.get('order') || '';

    const styleParams = useMemo(() => searchParams.get('style') ? searchParams.get('style').split(',') : [], [searchParams]);
    const publishingParam = useMemo(() => searchParams.get('publishing') || 'all', [searchParams]);

    const fetchStyles = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`${musiciansServiceURL}/v1/styles/`);
            setStyles(response.data);
        } catch (error) {
            console.error('Error fetching styles:', error);
        }
    }, []);


    // Get author name either from localStorage cache or from user service
    const getAuthorName = async (authorId) => {
        const usersCache = JSON.parse(localStorage.getItem('usersCache')) || [];
        const cachedUser = usersCache.find(user => user.id === authorId);

        if (cachedUser) {
            return cachedUser.username;
        } else {
            try {
                const response = await axiosInstance.get(`${usersServiceURL}/users/${authorId}/`);
                const newUser = response.data;
                usersCache.push(newUser);
                localStorage.setItem('usersCache', JSON.stringify(usersCache));
                return newUser.username;
            } catch (error) {
                console.error('Error fetching author details:', error);
                return 'Unknown';
            }
        }
    };

    // Fetch articles with author name
    const fetchArticles = useCallback(async () => {
        const stylesQuery = selectedStyles.length > 0 ? `&style=${encodeURIComponent(selectedStyles.join(','))}` : '';
        const pageSizeQuery = pageSize !== 3 ? `&page_size=${pageSize}` : '';
        const publishingQuery = selectedPublishing !== 'all' ? `&is_published=${selectedPublishing === 'true'}` : '';
        const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

        let orderingQuery = '';
        if (orderParam !== 'time-create-desc' && orderParam !== '') {
            const parts = orderParam.split('-');
            const direction = parts.pop();
            const field = parts.join('-');
            orderingQuery = `&ordering=${direction === 'asc' ? '' : '-'}${field.replace('style-name', 'style__name').replace('time-create', 'time_create')}`;
        }

        try {
            const response = await axiosInstance.get(`${musiciansServiceURL}/v1/author/musicians/?page=${page}${stylesQuery}${publishingQuery}${searchQuery}${pageSizeQuery}${orderingQuery}`);
            const {results, count, next} = response.data;

            const articlesWithDetails = await Promise.all(results.map(async article => {
                const styleId = parseInt(article.style.split('/').slice(-2, -1)[0]);
                const style = styles.find(s => s.id === styleId) || {name: 'Unknown'};
                const authorName = await getAuthorName(article.author_id);
                return {
                    ...article,
                    styleName: style.name,
                    authorName,
                };
            }));

            setArticles(articlesWithDetails);
            const totalPages = next ? Math.ceil(count / pageSize) : page;
            setPageCount(totalPages);
        } catch (error) {
            console.error('There was an error fetching the articles!', error);
        }
    }, [page, pageSize, selectedStyles, selectedPublishing, styles, searchTerm, orderParam]);

    useEffect(() => {
        fetchStyles();
    }, [fetchStyles]);

    useEffect(() => {
        if (styles.length > 0) {
            fetchArticles();
        }
    }, [page, pageSize, selectedStyles, selectedPublishing, styles, fetchArticles]);

    useEffect(() => {
        if (styles.length > 0) {
            setSelectedStyles(styles.filter(style => styleParams.includes(style.slug)).map(style => style.id));
        }
        setSelectedPublishing(publishingParam);
        setSelectedOrder(orderParam || 'time-create-desc');
    }, [styles, styleParams, publishingParam, orderParam]);

    const handlePageChange = (newPage) => {
        const params = {page: newPage};
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedPublishing !== 'all') {
            params['publishing'] = selectedPublishing;
        }
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        if (selectedOrder !== 'time-create-desc') {
            params['order'] = selectedOrder;
        }
        setSearchParams(params);
    };

    const handlePageSizeChange = (e) => {
        const newPageSize = parseInt(e.target.value);
        const params = {page: 1};
        if (newPageSize !== 3) {
            params['page-size'] = newPageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedPublishing !== 'all') {
            params['publishing'] = selectedPublishing;
        }
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        if (selectedOrder !== 'time-create-desc') {
            params['order'] = selectedOrder;
        }
        setSearchParams(params);
    };

    const handleStyleChange = (newSelectedStyles) => {
        setSelectedStyles(newSelectedStyles);
        const params = {page: 1};
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (newSelectedStyles.length > 0) {
            params['style'] = newSelectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedPublishing !== 'all') {
            params['publishing'] = selectedPublishing;
        }
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        if (selectedOrder !== 'time-create-desc') {
            params['order'] = selectedOrder;
        }
        setSearchParams(params);
    };

    const handlePublishingChange = (newPublishing) => {
        setSelectedPublishing(newPublishing);
        const params = {page: 1};
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (newPublishing !== 'all') {
            params['publishing'] = newPublishing;
        }
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        if (selectedOrder !== 'time-create-desc') {
            params['order'] = selectedOrder;
        }
        setSearchParams(params);
    };

    const handleOrderChange = (newOrder) => {
        setSelectedOrder(newOrder);
        const params = {page: 1};
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedPublishing !== 'all') {
            params['publishing'] = selectedPublishing;
        }
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        if (newOrder !== 'time-create-desc') {
            params['order'] = newOrder;
        }
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSelectedStyles([]);
        setSelectedPublishing('all');
        setSelectedOrder('time-create-desc');
        setSearchParams({page: 1, 'page-size': pageSize});
    };

    const handleStyleClick = (styleName) => {
        clearFilters();
        const style = styles.find(s => s.name === styleName);
        if (style) {
            handleStyleChange([style.id]);
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`${musiciansServiceURL}/v1/author/musicians/${articleToDelete}/`);
            setShowConfirm(false);
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    return (
        <BaseLayout>
            <Row>
                <Col lg={3}>
                    <BaseUserArticlesFilter
                        selectedStyles={selectedStyles}
                        onStyleChange={handleStyleChange}
                        styles={styles}
                        selectedPublishing={selectedPublishing}
                        onPublishingChange={handlePublishingChange}
                        clearFilters={clearFilters}
                        selectedOrder={selectedOrder}
                        onOrderChange={handleOrderChange}
                    />
                </Col>
                <Col lg={9} className="mobile-content">
                    <Search/>
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
                                        <p className="text-muted">
                                            Style: <button
                                            className="btn btn-link text-decoration-underline text-primary p-0"
                                            onClick={() => handleStyleClick(article.styleName)}>{article.styleName}</button>
                                        </p>
                                        <p className="text-muted">
                                            Author: <Link to="/"
                                                          className="text-decoration-underline text-primary p-0">{article.authorName}</Link>
                                        </p>
                                        <p className="text-muted">Created: {new Date(article.time_create).toLocaleString()}</p>
                                        <h5 className="mt-2">{article.title}</h5>
                                        <p>{article.content.substring(0, 300)}...</p>
                                        <div className="d-flex">
                                            <Button as={Link} to={`/articles/${article.id}`}
                                                    state={{fromUserArticles: true}}>Read article</Button>
                                            {isAuthenticated && user?.id === article.author_id && (
                                                <>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => navigate(`/article/edit/${article.id}`)}
                                                        className="mr-2 ml-2"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => {
                                                            setShowConfirm(true);
                                                            setArticleToDelete(article.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
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

                    <CustomPagination
                        currentPage={page}
                        totalPages={pageCount}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </Col>
            </Row>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                    <CloseButton onClick={() => setShowConfirm(false)}/>
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
}

export default UserArticles;
