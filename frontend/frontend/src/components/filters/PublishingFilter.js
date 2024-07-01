// src/components/filters/PublishingFilter.js
import React from 'react';
import { Form } from 'react-bootstrap';

const PublishingFilter = ({ selectedPublishing, onPublishingChange }) => {
    return (
        <Form>
            <Form.Check
                type="radio"
                id="publishing-all"
                label="All"
                value="all"
                checked={selectedPublishing === 'all'}
                onChange={() => onPublishingChange('all')}
            />
            <Form.Check
                type="radio"
                id="publishing-published"
                label="Published"
                value={true}
                checked={selectedPublishing === true}
                onChange={() => onPublishingChange(true)}
            />
            <Form.Check
                type="radio"
                id="publishing-unpublished"
                label="Unpublished"
                value={false}
                checked={selectedPublishing === false}
                onChange={() => onPublishingChange(false)}
            />
        </Form>
    );
};

export default PublishingFilter;
