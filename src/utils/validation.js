export const FIELD_ORDER = ['fullname', 'phone', 'email', 'reason', 'consent']

export const FIELD_LABELS = {
  fullname: 'Full name',
  phone: 'Telephone or mobile number',
  email: 'Email address',
  reason: 'Reason for visit',
  consent: 'Consent',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Returns an error message, or an empty string when the value is valid.
 * Messages say what is wrong and how to fix it (WCAG 3.3.1, 3.3.3).
 */
export function validateField(name, value) {
  switch (name) {
    case 'fullname': {
      const text = String(value).trim()
      if (!text) return 'Enter your full name.'
      if (!/\S+\s+\S+/.test(text)) return 'Enter your first name and surname.'
      return ''
    }
    case 'phone': {
      const text = String(value).trim()
      if (!text) return 'Enter a telephone or mobile number.'
      const digits = text.replace(/\D/g, '')
      const onlyPhoneCharacters = /^[\d\s()+-]+$/.test(text)
      if (!onlyPhoneCharacters || digits.length < 10 || digits.length > 15) {
        return 'Enter a valid telephone number with 10 to 15 digits, for example 012 345 6789.'
      }
      return ''
    }
    case 'email': {
      const text = String(value).trim()
      if (!text) return 'Enter an email address.'
      if (!EMAIL_PATTERN.test(text)) {
        return 'Enter an email address in the format name@example.com.'
      }
      return ''
    }
    case 'reason':
      return String(value).length > 300
        ? 'Keep your reason for visit to 300 characters or fewer.'
        : ''
    case 'consent':
      return value ? '' : 'Tick the box to give your consent before booking.'
    default:
      return ''
  }
}

export function validateAll(values) {
  const errors = {}
  FIELD_ORDER.forEach((name) => {
    const message = validateField(name, values[name])
    if (message) errors[name] = message
  })
  return errors
}
