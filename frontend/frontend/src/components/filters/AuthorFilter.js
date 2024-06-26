import React from 'react';
import { Form } from 'react-bootstrap';

const AuthorFilter = ({ selectedAuthor, onAuthorChange, users }) => {
    return (
        <Form>
            <Form.Check
                type="radio"
                id="author-all"
                label="All"
                value="all"
                checked={selectedAuthor === 'all'}
                onChange={() => onAuthorChange('all')}
            />
            {users.map(user => (
                <Form.Check
                    type="radio"
                    id={`author-${user.id}`}
                    label={user.username}
                    value={user.username}
                    checked={selectedAuthor === user.username}
                    onChange={() => onAuthorChange(user.username)}
                    key={user.id}
                />
            ))}
        </Form>
    );
};

export default AuthorFilter;
