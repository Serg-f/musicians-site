import React from 'react';
import { Card, Button } from 'react-bootstrap';
import StylesFilter from './StylesFilter';
import AuthorFilter from './AuthorFilter';

const BaseFilter = ({ selectedStyles, onStyleChange, styles, selectedAuthor, onAuthorChange, users, clearFilters }) => {
    return (
        <div>
            <h3>Filters</h3>
            <Card className="mb-3">
                <Card.Header>Style</Card.Header>
                <Card.Body>
                    <StylesFilter
                        selectedStyles={selectedStyles}
                        onStyleChange={onStyleChange}
                        styles={styles}
                    />
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Header>Author</Card.Header>
                <Card.Body>
                    <AuthorFilter
                        selectedAuthor={selectedAuthor}
                        onAuthorChange={onAuthorChange}
                        users={users}
                    />
                </Card.Body>
            </Card>
            <Button variant="secondary" onClick={clearFilters} className="mt-3">Clear Filters</Button>
        </div>
    );
};

export default BaseFilter;
