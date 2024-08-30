import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { axiosInstanceNoAuth, axiosInstance } from '../context/axiosInstances';
import { Row, Col, Button, Modal, CloseButton } from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import BaseFilter from './filters/BaseFilter';
import CustomPagination from './Pagination';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Search from './Search';
import { usersServiceURL, musiciansServiceURL } from '../context/serviceUrls';
import { toast } from 'react-toastify';

const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const STYLES_CACHE_KEY = 'stylesCache';
const STYLES_CACHE_TIME_KEY = 'stylesCacheTime';
const USERS_CACHE_KEY = 'usersCache';
const USERS_CACHE_TIME_KEY = 'usersCacheTime';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [styles, setStyles] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    const { user, isAuthenticated } = useContext(AuthContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState('time-create-desc');

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page-size') || '3');
    const searchTerm = searchParams.get('search') || '';
    const orderParam = searchParams.get('order') || '';

    const styleParams = useMemo(() => searchParams.get('style') ? searchParams.get('style').split(',') : [], [searchParams]);
    const authorParam = useMemo(() => searchParams.get('author') || 'all', [searchParams]);

    const isCacheExpired = (cacheTimeKey) => {
        const cacheTime = localStorage.getItem(cacheTimeKey);
        return !cacheTime || (Date.now() - parseInt(cacheTime, 10)) > CACHE_EXPIRATION_MS;
    };

    const fetchStyles = useCallback(async () => {
        try {
            const response = await axiosInstanceNoAuth.get(`${musiciansServiceURL}/v1/styles/`);
            setStyles(response.data);
            localStorage.setItem(STYLES_CACHE_KEY, JSON.stringify(response.data));
            localStorage.setItem(STYLES_CACHE_TIME_KEY, Date.now().toString());
        } catch (error) {
            console.error('Error fetching styles:', error);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axiosInstanceNoAuth.get(`${usersServiceURL}/users/`);
            setUsers(response.data);
            localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(response.data));
            localStorage.setItem(USERS_CACHE_TIME_KEY, Date.now().toString());
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    const fetchArticles = useCallback(async () => {
        const stylesQuery = selectedStyles.length > 0 ? `&style=${encodeURIComponent(selectedStyles.join(','))}` : '';
        const pageSizeQuery = pageSize !== 3 ? `&page_size=${pageSize}` : '';
        const authorQuery = selectedAuthor !== 'all' ? `&author_id=${users.find(user => user.username === selectedAuthor)?.id}` : '';
        const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

        let orderingQuery = '';
        if (orderParam !== 'time-create-desc' && orderParam !== '') {
            const parts = orderParam.split('-');
            const direction = parts.pop();
            const field = parts.join('-');
            orderingQuery = `&ordering=${direction === 'asc' ? '' : '-'}${field.replace('style-name', 'style__name').replace('time-create', 'time_create')}`;
        }

        try {
            const response = await axiosInstanceNoAuth.get(`${musiciansServiceURL}/v1/musicians/?page=${page}${stylesQuery}${authorQuery}${searchQuery}${pageSizeQuery}${orderingQuery}`);
            const { results, count, next } = response.data;

            const articlesWithDetails = results.map(article => {
                const styleId = parseInt(article.style.split('/').slice(-2, -1)[0]);
                const style = styles.find(s => s.id === styleId) || { name: 'Unknown' };
                const author = users.find(u => u.id === article.author_id) || { username: 'Unknown' };
                return {
                    ...article,
                    styleName: style.name,
                    authorName: author.username,
                };
            });

            setArticles(articlesWithDetails);
            const totalPages = next ? Math.ceil(count / pageSize) : page;
            setPageCount(totalPages);

        } catch (error) {
            console.error('There was an error fetching the articles!', error);
        }
    }, [page, pageSize, selectedStyles, selectedAuthor, users, styles, searchTerm, orderParam]);

    useEffect(() => {
        const storedStyles = localStorage.getItem(STYLES_CACHE_KEY);
        const storedUsers = localStorage.getItem(USERS_CACHE_KEY);

        if (storedStyles && !isCacheExpired(STYLES_CACHE_TIME_KEY)) {
            setStyles(JSON.parse(storedStyles));
        } else {
            fetchStyles();
        }

        if (storedUsers && !isCacheExpired(USERS_CACHE_TIME_KEY)) {
            setUsers(JSON.parse(storedUsers));
        } else {
            fetchUsers();
        }
    }, [fetchStyles, fetchUsers]);

    useEffect(() => {
        if (users.length > 0 && styles.length > 0) {
            fetchArticles();
        }
    }, [page, pageSize, selectedStyles, selectedAuthor, users, styles, fetchArticles]);

    useEffect(() => {
        if (styles.length > 0) {
            setSelectedStyles(styles.filter(style => styleParams.includes(style.slug)).map(style => style.id));
        }
        setSelectedAuthor(authorParam);
        setSelectedOrder(orderParam || 'time-create-desc');
    }, [styles, users, styleParams, authorParam, orderParam]);

    const handlePageChange = (newPage) => {
        const params = { page: newPage };
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedAuthor !== 'all') {
            params['author'] = selectedAuthor;
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
        const params = { page: 1 };
        if (newPageSize !== 3) {
            params['page-size'] = newPageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedAuthor !== 'all') {
            params['author'] = selectedAuthor;
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
        const params = { page: 1 };
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (newSelectedStyles.length > 0) {
            params['style'] = newSelectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedAuthor !== 'all') {
            params['author'] = selectedAuthor;
        }
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        if (selectedOrder !== 'time-create-desc') {
            params['order'] = selectedOrder;
        }
        setSearchParams(params);
    };

    const handleAuthorChange = (newAuthor) => {
        setSelectedAuthor(newAuthor);
        const params = { page: 1 };
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (newAuthor !== 'all') {
            params['author'] = newAuthor;
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
        const params = { page: 1 };
        if (pageSize !== 3) {
            params['page-size'] = pageSize;
        }
        if (selectedStyles.length > 0) {
            params['style'] = selectedStyles.map(styleId => {
                const style = styles.find(s => s.id === styleId);
                return style ? style.slug : '';
            }).join(',');
        }
        if (selectedAuthor !== 'all') {
            params['author'] = selectedAuthor;
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
        setSelectedAuthor('all');
        setSelectedOrder('time-create-desc');
        setSearchParams({ page: 1, 'page-size': pageSize });
    };

    const handleStyleClick = (styleName) => {
        clearFilters();
        const style = styles.find(s => s.name === styleName);
        if (style) {
            handleStyleChange([style.id]);
        }
    };

    const handleAuthorClick = (authorName) => {
        clearFilters();
        handleAuthorChange(authorName);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`${musiciansServiceURL}/v1/author/musicians/${articleToDelete}/`);
            setShowConfirm(false);
            toast.success('Article deleted successfully!');
            fetchUsers();
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    return (
        <BaseLayout>
            <Row>
                <Col lg={3}>
                    <BaseFilter
                        selectedStyles={selectedStyles}
                        onStyleChange={handleStyleChange}
                        styles={styles}
                        selectedAuthor={selectedAuthor}
                        onAuthorChange={handleAuthorChange}
                        users={users}
                        clearFilters={clearFilters}
                        selectedOrder={selectedOrder}
                        onOrderChange={handleOrderChange}
                    />
                </Col>
                <Col lg={9} className="mobile-content">
                    <Search />
                    <Row>
                        {articles.length > 0 ? articles.map(article => (
                            <Col key={article.id} lg={12} className="mb-4">
                                <Row className="p-3 border-bottom">
                                    {article.photo && (
                                        <Col md="auto" className="mb-3 mb-md-0">
                                            <img src={`${musiciansServiceURL}${article.photo}`} alt={article.title} className="img-fluid"
                                                style={{ maxWidth: '300px', width: '100%', height: 'auto' }} />
                                        </Col>
                                    )}
                                    <Col>
                                        <p className="text-muted">
                                            Style: <button
                                                className="btn btn-link text-decoration-underline text-primary p-0"
                                                onClick={() => handleStyleClick(article.styleName)}>{article.styleName}</button>
                                        </p>
                                        <p className="text-muted">
                                            Author: <button
                                                className="btn btn-link text-decoration-underline text-primary p-0"
                                                onClick={() => handleAuthorClick(article.authorName)}>{article.authorName}</button>
                                        </p>
                                        <p className="text-muted">Created: {new Date(article.time_create).toLocaleString()}</p>
                                        <h5 className="mt-2">{article.title}</h5>
                                        <p>{article.content.substring(0, 300)}...</p>
                                        <div className="d-flex">
                                            <Button variant="primary" href={`/articles/${article.id}`}>Read article</Button>

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
}

export default Home;
