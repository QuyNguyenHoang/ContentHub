

interface PagingProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Paging({
  currentPage,
  totalPages,
  onPageChange,
}: PagingProps) {
  const maxVisiblePages = 5;

  const startPage = Math.max(
    1,
    currentPage - Math.floor(maxVisiblePages / 2),
  );

  const endPage = Math.min(
    totalPages,
    startPage + maxVisiblePages - 1,
  );

  if (totalPages <= 0) return null;

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mt-3 gap-2">
      <ul className="pagination mb-0 flex-wrap justify-content-center">
        {/* FIRST */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(1)}
          >
            «
          </button>
        </li>

        {/* PREV */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() =>
              onPageChange(Math.max(currentPage - 1, 1))
            }
          >
            ‹
          </button>
        </li>

        {/* SHOW FIRST PAGE */}
        {startPage > 1 && (
          <>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
            </li>

            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {/* PAGE NUMBERS */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i,
        ).map((page) => (
          <li
            key={page}
            className={`page-item ${
              currentPage === page ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* SHOW LAST PAGE */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}

            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* NEXT */}
        <li
          className={`page-item ${
            currentPage >= totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() =>
              onPageChange(
                Math.min(currentPage + 1, totalPages),
              )
            }
          >
            ›
          </button>
        </li>

        {/* LAST */}
        <li
          className={`page-item ${
            currentPage >= totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
          >
            »
          </button>
        </li>
      </ul>

      {/* PAGE SELECT */}
      <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
        <span className="small">Go to page</span>

        <select
          className="form-select form-select-sm"
          style={{ width: "70px" }}
          value={currentPage}
          onChange={(e) =>
            onPageChange(Number(e.target.value))
          }
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <span className="small">of {totalPages}</span>
      </div>
    </div>
  );
}