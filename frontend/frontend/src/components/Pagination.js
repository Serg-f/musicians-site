import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const CustomPagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange }) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;

        // Always show first page
        if (totalPages > 1) {
            pageNumbers.push(
                <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(1)}>1</button>
                </li>
            );
        }

        if (totalPages <= maxPageNumbersToShow) {
            for (let i = 2; i <= totalPages; i++) {
                pageNumbers.push(
                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(i)}>{i}</button>
                    </li>
                );
            }
        } else {
            const startPage = Math.max(2, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);

            if (startPage > 2) {
                pageNumbers.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">…</span></li>);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(i)}>{i}</button>
                    </li>
                );
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">…</span></li>);
            }

            // Always show last page
            if (totalPages > 1) {
                pageNumbers.push(
                    <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                    </li>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <Row className="mb-3">
            {totalPages > 1 && (
                <Col md="auto">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" aria-label="Previous" onClick={() => { if (currentPage > 1) onPageChange(currentPage - 1); }}>
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                        {renderPageNumbers()}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" aria-label="Next" onClick={() => { if (currentPage < totalPages) onPageChange(currentPage + 1); }}>
                                <span aria-hidden="true">»</span>
                            </button>
                        </li>
                    </ul>
                </Col>
            )}
            <Col md="auto" className="ml-md-auto">
                <Form.Group as={Row} className="flex-nowrap">
                    <Form.Label column sm="auto">Articles per page</Form.Label>
                    <Col sm="auto">
                        <Form.Control
                            as="select"
                            value={pageSize}
                            onChange={onPageSizeChange}
                        >
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </Form.Control>
                    </Col>
                </Form.Group>
            </Col>
        </Row>
    );
};

export default CustomPagination;
