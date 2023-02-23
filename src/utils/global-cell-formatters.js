import i18n from '@/plugins/i18n/i18n'
import moment from 'moment-timezone'

export const booleanFormatter = (value) => {
  if (value) {
    return i18n.t('general.yes')
  }

  return i18n.t('general.no')
}

export const dateTimeFormatter = (value) => {
  const dateValue = moment(value)
  if (!dateValue.isValid()) {
    return value
  }

  return dateValue.format('DD-MM-YYYY') + ' | ' + dateValue.format('HH:mm')
}

export const listFormatter = (value) => {
  return value.join(', ')
}

export const dataSizeFormatter = (value) => {
  if (!value) {
    return '0 KB'
  }

  const sizeValues = {
    'kb': 1,
    'mb': 1024,
    'gb': 1024 * 1024,
    'tb': 1024 * 1024 * 1024
  }

  if (value > sizeValues.tb) {
    return (value / sizeValues.tb).toFixed(2) + ' TB'
  } else if (value > sizeValues.gb) {
    return (value / sizeValues.gb).toFixed(2) + ' GB'
  } else if (value > sizeValues.mb) {
    return (value / sizeValues.mb).toFixed(2) + ' MB'
  } else {
    return (value / sizeValues.kb).toFixed(2) + ' KB'
  }
}
