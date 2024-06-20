// src/components/StylesFilter.js
import React, {useState} from 'react';
import {Form, Button, ListGroup} from 'react-bootstrap';

const StylesFilter = ({selectedStyles, onStyleChange}) => {
    const styles = ['Pop', 'Rock', 'Metal', 'Rap'];

    const handleStyleChange = (event) => {
        const value = event.target.value;
        if (selectedStyles.includes(value)) {
            onStyleChange(selectedStyles.filter(style => style !== value));
        } else {
            onStyleChange([...selectedStyles, value]);
        }
    };

    return (
        <div className="sticky-menu">
            <ListGroup>
                {styles.map(style => (
                    <ListGroup.Item key={style}>
                        <Form.Check
                            type="checkbox"
                            label={style}
                            value={style}
                            checked={selectedStyles.includes(style)}
                            onChange={handleStyleChange}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Button variant="primary" className="mt-2" onClick={() => alert('Filtered!')}>
                Apply Filters
            </Button>
        </div>
    );
};

export default StylesFilter;
