import React from 'react';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
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
    );
};

export default CustomPagination;
