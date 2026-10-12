import { describe, expect, it } from 'vitest'
import { validateAll, validateField } from './validation.js'

describe('validateField', () => {
  it('requires a first name and a surname', () => {
    expect(validateField('fullname', '')).toMatch(/enter your full name/i)
    expect(validateField('fullname', 'Thandi')).toMatch(/first name and surname/i)
    expect(validateField('fullname', 'Thandi Mokoena')).toBe('')
  })

  it('accepts common phone formats and rejects short or lettered numbers', () => {
    expect(validateField('phone', '012 345 6789')).toBe('')
    expect(validateField('phone', '+27 82 123 4567')).toBe('')
    expect(validateField('phone', '012 345')).toMatch(/valid telephone number/i)
    expect(validateField('phone', 'call me maybe')).toMatch(/valid telephone number/i)
    expect(validateField('phone', '')).toMatch(/enter a telephone/i)
  })

  it('validates the email format', () => {
    expect(validateField('email', 'thandi@example.com')).toBe('')
    expect(validateField('email', 'thandi@example')).toMatch(/name@example\.com/)
    expect(validateField('email', '')).toMatch(/enter an email/i)
  })

  it('keeps the optional reason under 300 characters', () => {
    expect(validateField('reason', '')).toBe('')
    expect(validateField('reason', 'x'.repeat(300))).toBe('')
    expect(validateField('reason', 'x'.repeat(301))).toMatch(/300 characters/)
  })

  it('requires consent to be ticked', () => {
    expect(validateField('consent', false)).toMatch(/consent/i)
    expect(validateField('consent', true)).toBe('')
  })
})

describe('validateAll', () => {
  it('returns an error for every invalid required field', () => {
    const errors = validateAll({
      fullname: '',
      phone: '012',
      email: 'nope',
      reason: '',
      consent: false,
    })
    expect(Object.keys(errors)).toEqual(['fullname', 'phone', 'email', 'consent'])
  })

  it('returns an empty object for valid values', () => {
    expect(
      validateAll({
        fullname: 'Thandi Mokoena',
        phone: '012 345 6789',
        email: 'thandi@example.com',
        reason: '',
        consent: true,
      }),
    ).toEqual({})
  })
})
