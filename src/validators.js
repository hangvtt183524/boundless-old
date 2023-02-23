import { helpers } from 'vuelidate/lib/validators'

export const nonBlank = (value) => !helpers.req(value) || value.trim() !== ''

export const macAddress = (value) => {
  const regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i
  return regexp.test(value)
}
