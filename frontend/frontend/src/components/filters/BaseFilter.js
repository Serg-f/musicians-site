import React from 'react';
import StylesFilter from './StylesFilter';
import AuthorFilter from './AuthorFilter';

const BaseFilter = ({ selectedStyles, onStyleChange, styles, selectedAuthor, onAuthorChange, users }) => {
    return (
        <div>
            <StylesFilter
                selectedStyles={selectedStyles}
                onStyleChange={onStyleChange}
                styles={styles}
            />
            <AuthorFilter
                selectedAuthor={selectedAuthor}
                onAuthorChange={onAuthorChange}
                users={users}
            />
        </div>
    );
};

export default BaseFilter;
