/**
 * A labelled form control with helper text and an error message.
 *
 * - The <label> is tied to the control with htmlFor/id.
 * - Helper text and the error message are tied to the control with
 *   aria-describedby, so a screen reader reads them when the field is focused.
 * - aria-invalid mirrors the error state.
 * - "(required)" and "(optional)" are written as text, not colour or symbols.
 */
export default function TextField({
  id,
  label,
  hint,
  error,
  required = false,
  optional = false,
  as: Control = 'input',
  ...controlProps
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}{' '}
        {required && <span className="required">(required)</span>}
        {optional && <span className="optional">(optional)</span>}
      </label>
      {hint && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          <span className="icon" aria-hidden="true">
            !
          </span>
          <span>
            <strong>Error:</strong> {error}
          </span>
        </p>
      )}
      <Control
        id={id}
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={describedBy || undefined}
        {...controlProps}
      />
    </div>
  )
}
