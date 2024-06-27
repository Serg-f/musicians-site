import React, {useState} from 'react';
import {Form, FormControl, Button, Row, Col} from 'react-bootstrap';
import {useSearchParams} from 'react-router-dom';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const params = {page: 1, 'page-size': searchParams.get('page-size') || 3};
        if (searchTerm) {
            params['search'] = searchTerm;
        }
        setSearchParams(params);
    };

    return (
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
                <Col xs="auto">
                    <Button variant="outline-success" type="submit">Search</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default Search;
