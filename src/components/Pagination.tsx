import React from 'react';

const Pagination = ({currentPage, setCurrentPage, totalPages} : {currentPage: number, totalPages: number, setCurrentPage: (prop: number) => void}) => {
    return (
        <div className="container mx-auto py-5 text-center">
        {currentPage >= 1 && <button onClick={() => (setCurrentPage(currentPage - 1))}>
          <p>
            <i className="bi bi-caret-left-fill"></i>
          </p>
          </button>}
        {totalPages > 1 && [...Array(totalPages)].map((_, index) => (
          <button key={`page-${index + 1}`} disabled={currentPage === index || (currentPage === 0 && index === 0)} onClick={() => (setCurrentPage(index))}>{index + 1}</button>
        ))}
        {(currentPage + 1 != totalPages && totalPages > 1) && <button onClick={() => (setCurrentPage(currentPage + 1))}>
          <p>
            <i className="bi bi-caret-right-fill"></i>
          </p>
          </button>}
       </div>
    )
}

export default Pagination;