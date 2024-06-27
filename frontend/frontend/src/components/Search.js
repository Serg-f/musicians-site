import React, { useState, useEffect } from 'react';
import { Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const search = searchParams.get('search') || '';
        setSearchTerm(search);
    }, [searchParams]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.length < 3) {
            toast.error('Search term must be at least 3 characters long.');
            return;
        }
        const params = { page: 1, 'page-size': searchParams.get('page-size') || 3 };
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        setSearchParams(params);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        const params = { page: 1, 'page-size': searchParams.get('page-size') || 3 };
        setSearchParams(params);
    };

    return (
        <>
            <ToastContainer />
            <Form onSubmit={handleSearchSubmit}>
                <Row>
                    <Col>
                        <FormControl
                            type="text"
                            placeholder="Search articles"
                            className="mr-sm-2"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Col>
                    {searchTerm && (
                        <Col xs="auto">
                            <Button variant="outline-danger" onClick={handleClearSearch}>✕</Button>
                        </Col>
                    )}
                    <Col xs="auto">
                        <Button variant="outline-success" type="submit">Search</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Search;
