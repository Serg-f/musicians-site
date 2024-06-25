// src/components/StylesFilter.js
import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';

const StylesFilter = ({ selectedStyles, onStyleChange, styles }) => {
    const handleStyleChange = (event) => {
        const value = parseInt(event.target.value); // Ensure the value is an integer
        let newSelectedStyles;
        if (selectedStyles.includes(value)) {
            newSelectedStyles = selectedStyles.filter(style => style !== value);
        } else {
            newSelectedStyles = [...selectedStyles, value];
        }
        onStyleChange(newSelectedStyles);
    };

    return (
        <div className="sticky-menu">
            <ListGroup>
                {styles.map(style => (
                    <ListGroup.Item key={style.id}>
                        <Form.Check
                            type="checkbox"
                            label={style.name}
                            value={style.id}
                            checked={selectedStyles.includes(style.id)}
                            onChange={handleStyleChange}
                        />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default StylesFilter;
