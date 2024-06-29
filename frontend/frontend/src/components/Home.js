import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Row, Col, Button } from 'react-bootstrap';
import BaseLayout from './BaseLayout';
import BaseFilter from './filters/BaseFilter';
import CustomPagination from './Pagination';
import { AuthContext } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import Search from './Search'; // Import Search component

const CACHE_KEY = 'stylesCache';
const CACHE_EXPIRATION_KEY = 'stylesCacheExpiration';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const USERS_CACHE_KEY = 'usersCache';
const USERS_CACHE_EXPIRATION_KEY = 'usersCacheExpiration';
const USERS_CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [styles, setStyles] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    const { user, isAuthenticated, verifyAuth } = useContext(AuthContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page-size') || '3');
    const searchTerm = searchParams.get('search') || '';

    const styleParams = useMemo(() => searchParams.get('style') ? searchParams.get('style').split(',') : [], [searchParams]);
    const authorParam = useMemo(() => searchParams.get('author') || 'all', [searchParams]);

    const fetchStyles = useCallback(async () => {
        const cachedStyles = localStorage.getItem(CACHE_KEY);
        const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);

        if (cachedStyles && cacheExpiration && new Date().getTime() < parseInt(cacheExpiration)) {
            setStyles(JSON.parse(cachedStyles));
        } else {
            try {
                const response = await axios.get('http://localhost:8000/v1/styles/');
                setStyles(response.data);
                localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
                localStorage.setItem(CACHE_EXPIRATION_KEY, (new Date().getTime() + CACHE_DURATION).toString());
            } catch (error) {
                console.error('Error fetching styles:', error);
            }
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        const cachedUsers = localStorage.getItem(USERS_CACHE_KEY);
        const usersCacheExpiration = localStorage.getItem(USERS_CACHE_EXPIRATION_KEY);

        if (cachedUsers && usersCacheExpiration && new Date().getTime() < parseInt(usersCacheExpiration)) {
            setUsers(JSON.parse(cachedUsers));
        } else {
            try {
                const response = await axios.get('http://localhost:8020/users/');
                setUsers(response.data);
                localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(response.data));
                localStorage.setItem(USERS_CACHE_EXPIRATION_KEY, (new Date().getTime() + USERS_CACHE_DURATION).toString());
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    }, []);

    const fetchArticles = useCallback(async () => {
        const stylesQuery = selectedStyles.length > 0 ? `&style=${encodeURIComponent(selectedStyles.join(','))}` : '';
        const pageSizeQuery = pageSize !== 3 ? `&page_size=${pageSize}` : '';
        const authorQuery = selectedAuthor !== 'all' ? `&author_id=${users.find(user => user.username === selectedAuthor)?.id}` : '';
        const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';

        try {
            const response = await axios.get(`http://localhost:8000/v1/musicians/?page=${page}${pageSizeQuery}${stylesQuery}${authorQuery}${searchQuery}`);
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
    }, [page, pageSize, selectedStyles, selectedAuthor, users, styles, searchTerm]);

    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    useEffect(() => {
        fetchStyles();
        fetchUsers();
    }, [fetchStyles, fetchUsers]);

    useEffect(() => {
        if (users.length > 0 && styles.length > 0) {
            fetchArticles();
        }
    }, [page, pageSize, selectedStyles, selectedAuthor, users, styles, fetchArticles]);

    useEffect(() => {
        // Set filters based on URL query parameters
        if (styles.length > 0) {
            setSelectedStyles(styles.filter(style => styleParams.includes(style.slug)).map(style => style.id));
        }
        setSelectedAuthor(authorParam);
    }, [styles, users, styleParams, authorParam]);

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
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSelectedStyles([]);
        setSelectedAuthor('all');
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
                    />
                </Col>
                <Col lg={9} className="mobile-content">
                    <Search /> {/* Add the Search component */}
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
                                                    <Button variant="secondary"
                                                        href={`/article/edit/${article.id}`}
                                                        style={{ margin: '0 5px' }}>Edit</Button>
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

                    <CustomPagination
                        currentPage={page}
                        totalPages={pageCount}
                        onPageChange={handlePageChange}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </Col>
            </Row>
        </BaseLayout>
    );
}

export default Home;
