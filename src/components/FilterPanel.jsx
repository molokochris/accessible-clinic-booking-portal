import { DAY_OPTIONS, TYPE_OPTIONS, URGENCY_OPTIONS } from '../data/services.js'
import FilterGroup from './FilterGroup.jsx'
import ToggleButton from './ToggleButton.jsx'

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

/**
 * Filter controls edit a draft. Nothing is filtered until "Apply filters" is
 * pressed, so a keyboard or screen reader user can tick several boxes without
 * hearing a results announcement after every single change.
 */
export default function FilterPanel({ draft, onDraftChange, onApply, onClear }) {
  const update = (group, value) =>
    onDraftChange({ ...draft, [group]: toggleValue(draft[group], value) })

  return (
    <section className="filters" aria-labelledby="filters-title">
      <h2 id="filters-title">Filter results</h2>
      <form onSubmit={onApply}>
        <FilterGroup id="urgency" title="Urgency level">
          {URGENCY_OPTIONS.map((option) => (
            <label className="check" key={option.value}>
              <input
                type="checkbox"
                name="urgency"
                value={option.value}
                checked={draft.urgency.includes(option.value)}
                onChange={() => update('urgency', option.value)}
              />
              {option.label}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup id="type" title="Service type">
          {TYPE_OPTIONS.map((option) => (
            <label className="check" key={option.value}>
              <input
                type="checkbox"
                name="type"
                value={option.value}
                checked={draft.type.includes(option.value)}
                onChange={() => update('type', option.value)}
              />
              {option.label}
            </label>
          ))}
        </FilterGroup>

        <FilterGroup id="day" title="Day available">
          <div className="chip-row">
            {DAY_OPTIONS.map((option) => (
              <ToggleButton
                key={option.value}
                pressed={draft.day.includes(option.value)}
                onToggle={() => update('day', option.value)}
              >
                {option.label}
              </ToggleButton>
            ))}
          </div>
        </FilterGroup>

        <div className="button-group">
          <button type="submit" className="button button-primary">
            Apply filters
          </button>
          <button type="button" className="button button-secondary" onClick={onClear}>
            Clear filters
          </button>
        </div>
      </form>
    </section>
  )
}
