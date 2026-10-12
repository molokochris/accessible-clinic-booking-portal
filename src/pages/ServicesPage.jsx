import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel.jsx'
import Pagination from '../components/Pagination.jsx'
import ResultsList from '../components/ResultsList.jsx'
import { useAnnouncer } from '../context/announcerContext.js'
import { SERVICES, TYPE_OPTIONS, filterServices } from '../data/services.js'
import usePageTitle from '../hooks/usePageTitle.js'

const PAGE_SIZE = 4
const NO_FILTERS = { urgency: [], type: [], day: [] }
const VALID_TYPES = TYPE_OPTIONS.map((option) => option.value)

function describeResults(count, applied) {
  const filterCount = applied.urgency.length + applied.type.length + applied.day.length
  let text = `Showing ${count} ${count === 1 ? 'result' : 'results'}`
  if (applied.q) text += ` for “${applied.q}”`
  if (filterCount) text += ` with ${filterCount} ${filterCount === 1 ? 'filter' : 'filters'} applied`
  return text
}

export default function ServicesPage() {
  usePageTitle('Services')
  const announce = useAnnouncer()
  const [params] = useSearchParams()

  // Initial search and category can arrive from the home page via the URL.
  const [initial] = useState(() => ({
    q: params.get('q') ?? '',
    ...NO_FILTERS,
    type: params.getAll('type').filter((value) => VALID_TYPES.includes(value)),
  }))

  const [queryInput, setQueryInput] = useState(initial.q)
  const [draft, setDraft] = useState({
    urgency: initial.urgency,
    type: initial.type,
    day: initial.day,
  })
  const [applied, setApplied] = useState(initial)
  const [page, setPage] = useState(1)

  const searchRef = useRef(null)
  const resultsHeadingRef = useRef(null)
  const focusResultsAfterPageChange = useRef(false)

  const results = useMemo(() => filterServices(SERVICES, applied), [applied])
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // After moving to another page of results, put focus on the results heading
  // so keyboard and screen reader users are not left on a button that has
  // just changed or been disabled.
  useEffect(() => {
    if (focusResultsAfterPageChange.current) {
      focusResultsAfterPageChange.current = false
      resultsHeadingRef.current?.focus()
    }
  }, [page])

  const handleSearch = (event) => {
    event.preventDefault()
    setApplied((current) => ({ ...current, q: queryInput.trim() }))
    setPage(1)
  }

  const handleApplyFilters = (event) => {
    event.preventDefault()
    setApplied((current) => ({ ...current, ...draft }))
    setPage(1)
  }

  const handleClearFilters = () => {
    setDraft(NO_FILTERS)
    setApplied((current) => ({ ...current, ...NO_FILTERS }))
    setPage(1)
  }

  const handleResetAll = () => {
    setQueryInput('')
    setDraft(NO_FILTERS)
    setApplied({ q: '', ...NO_FILTERS })
    setPage(1)
    searchRef.current?.focus()
  }

  const handlePageChange = (nextPage) => {
    focusResultsAfterPageChange.current = true
    setPage(nextPage)
    announce(`Page ${nextPage} of ${totalPages}`)
  }

  return (
    <>
      <h1>Available Clinic Services</h1>

      <form className="search" role="search" onSubmit={handleSearch}>
        <label htmlFor="service-search">Search services or practitioners</label>
        <div className="search-row">
          <input
            ref={searchRef}
            type="search"
            id="service-search"
            name="q"
            autoComplete="off"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
          <button type="submit" className="button button-primary">
            Search
          </button>
        </div>
      </form>

      <div className="listing">
        <FilterPanel
          draft={draft}
          onDraftChange={setDraft}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <section className="results" aria-labelledby="results-title">
          <h2 id="results-title" ref={resultsHeadingRef} tabIndex={-1}>
            Search results
          </h2>
          {/* Live region: present from first render, only its text changes. */}
          <p className="results-status" role="status" aria-live="polite">
            {describeResults(results.length, applied)}
          </p>

          {results.length === 0 ? (
            <div className="empty-state">
              <h3>No clinic services match your search</h3>
              <p>Try a different search term, or remove some filters.</p>
              <button
                type="button"
                className="button button-primary"
                onClick={handleResetAll}
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <>
              <ResultsList services={visible} />
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </>
  )
}
