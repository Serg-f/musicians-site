import React from 'react';
import { Form } from 'react-bootstrap';

const AuthorFilter = ({ selectedAuthor, onAuthorChange, users }) => {
    return (
        <div className="sticky-menu">
            <Form>
                <Form.Check
                    type="radio"
                    label="All"
                    value="all"
                    checked={selectedAuthor === 'all'}
                    onChange={() => onAuthorChange('all')}
                />
                {users.map(user => (
                    <Form.Check
                        type="radio"
                        label={user.username}
                        value={user.username}
                        checked={selectedAuthor === user.username}
                        onChange={() => onAuthorChange(user.username)}
                        key={user.id}
                    />
                ))}
            </Form>
        </div>
    );
};

export default AuthorFilter;
