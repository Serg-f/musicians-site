import React from 'react';
import { Form } from 'react-bootstrap';

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
        <Form>
            {styles.map(style => (
                <Form.Check
                    type="checkbox"
                    id={`style-${style.id}`}
                    label={style.name}
                    value={style.id}
                    checked={selectedStyles.includes(style.id)}
                    onChange={handleStyleChange}
                    key={style.id}
                />
            ))}
        </Form>
    );
};

export default StylesFilter;
