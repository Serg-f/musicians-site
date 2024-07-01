// src/components/filters/Ordering.js
import React from 'react';
import { Form } from 'react-bootstrap';

const radioButtons = [
    { id: "order-time-create-asc", label: "Time create - Asc", value: "time-create-asc" },
    { id: "order-time-create-desc", label: "Time create - Desc", value: "time-create-desc" },
    { id: "order-title-asc", label: "Title - Asc", value: "title-asc" },
    { id: "order-title-desc", label: "Title - Desc", value: "title-desc" },
    { id: "order-style-name-asc", label: "Style name - Asc", value: "style-name-asc" },
    { id: "order-style-name-desc", label: "Style name - Desc", value: "style-name-desc" }
];

const Ordering = ({ selectedOrder, onOrderChange }) => {
    const handleOrderChange = (event) => {
        onOrderChange(event.target.value);
    };

    return (
        <Form>
            {radioButtons.map((radio) => (
                <Form.Check
                    key={radio.id}
                    type="radio"
                    id={radio.id}
                    label={radio.label}
                    value={radio.value}
                    checked={selectedOrder === radio.value}
                    onChange={handleOrderChange}
                />
            ))}
        </Form>
    );
};

export default Ordering;
