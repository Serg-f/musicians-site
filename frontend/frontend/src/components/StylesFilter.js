// src/components/StylesFilter.js
import React, { useEffect, useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const StylesFilter = ({ selectedStyles, onStyleChange }) => {
    const [styles, setStyles] = useState([]);

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/styles/');
                setStyles(response.data);
            } catch (error) {
                console.error('Error fetching styles:', error);
            }
        };
        fetchStyles();
    }, []);

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
