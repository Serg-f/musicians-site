// src/components/filters/BaseUserArticlesFilter.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import StylesFilter from './StylesFilter';
import PublishingFilter from './PublishingFilter';
import Ordering from './Ordering';

const BaseUserArticlesFilter = ({
    selectedStyles,
    onStyleChange,
    styles,
    selectedPublishing,
    onPublishingChange,
    clearFilters,
    selectedOrder,
    onOrderChange
}) => {
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
                <Card.Header>Publishing</Card.Header>
                <Card.Body>
                    <PublishingFilter
                        selectedPublishing={selectedPublishing}
                        onPublishingChange={onPublishingChange}
                    />
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Header>Ordering</Card.Header>
                <Card.Body>
                    <Ordering
                        selectedOrder={selectedOrder}
                        onOrderChange={onOrderChange}
                    />
                </Card.Body>
            </Card>
            <Button variant="secondary" onClick={clearFilters} className="mb-3">Clear Filters</Button>
        </div>
    );
};

export default BaseUserArticlesFilter;
