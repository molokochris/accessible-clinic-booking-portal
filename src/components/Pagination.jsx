export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="button button-secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <p>
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        className="button button-secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  )
}
