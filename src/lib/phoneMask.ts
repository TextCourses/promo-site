/** Canonical Russian phone input contract shared by every lead template. */

export const RUSSIAN_PHONE_MASK_LENGTH = 18
export const RUSSIAN_PHONE_PATTERN = String.raw`\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}`

function nationalDigits(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('8') || digits.startsWith('7')) {
    return digits.slice(1, 11)
  }
  return digits.slice(0, 10)
}

/** Preserve a partially typed value while steering it into +7 (999) 123-45-67. */
export function formatRussianPhone(value: string): string {
  const national = nationalDigits(value)
  if (!national && !value.replace(/\D/g, '')) return ''

  let formatted = '+7'
  if (national.length === 0) return formatted
  formatted += ` (${national.slice(0, 3)}`
  if (national.length < 3) return formatted
  formatted += ')'
  if (national.length === 3) return formatted
  formatted += ` ${national.slice(3, 6)}`
  if (national.length <= 6) return formatted
  formatted += `-${national.slice(6, 8)}`
  if (national.length <= 8) return formatted
  return `${formatted}-${national.slice(8, 10)}`
}

export function isRussianPhoneComplete(value: string): boolean {
  return new RegExp(`^${RUSSIAN_PHONE_PATTERN}$`).test(value)
}
