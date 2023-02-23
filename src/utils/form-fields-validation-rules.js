import { isName, isNumber, isEmail } from './functions'
import _ from 'lodash'

let nameRules = (fieldName) => [
  v => !!v || `${fieldName} is required`,
  v => isName(v) || `${fieldName} must be valid`
]

let emailRules = () => [
  v => !!v || 'E-mail is required',
  v => isEmail(v) || 'E-mail must be valid'
]

let numberRules = (fieldName) => [
  v => !!v || `${fieldName} is required`,
  v => isNumber(v) || `${fieldName} must be valid`
]

let passwordRules = (password, password2) => {
  let passRules = [
    (v) => !!v || 'Password is required',
    (v) => v.length >= 8 || 'At least 8 characters',
    () => password === password2 || 'Passwords do not match'
  ]

  if (password2 !== null) {
    passRules.push(() => password === password2)
  }

  return passRules
}

let requiredField = (message) => [
  v => !!v || message
]

let maxCharCount = (v, s) => [
  (v) => v ? v.length <= s || `Max ${s} characters` : ''
]

let isValidMacAddress = (value) => {
  const regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i
  return regexp.test(value)
}

let isValidEmail = (value) => {
  return isEmail(value)
}

let isValidNonNegativeInteger = (value) => {
  return (value && /^\d+$/.test(value))
}

let isValidUrl = (value) => {
  const regexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi
  return regexp.test(value)
}

let isValidPort = (value) => {
  return (value && /^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) <= 65535)
}

let isValidPortRange = (value) => {
  return (value && /^\d+-\d+$/.test(value) && isValidPort(value.split('-')[0]) && isValidPort(value.split('-')[1]) &&
    parseInt(value.split('-')[0]) <= parseInt(value.split('-')[1]))
}

let isValidPortList = (value) => {
  return (value && /^\d+(,\d+)*$/.test(value) &&
    value.split(',').filter(portValue => !isValidPort(portValue)).length === 0)
}

let isValidVlan = (value) => {
  return (value && /^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) < 4096)
}

let isValidSwitchPortVlan = (value) => {
  return (value && /^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) < 4095)
}

let isValidIpAddress = (value) => {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value)
}

let isValidCidr = (value) => {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(value)
}

let isValidCidrWithPort = (value) => {
  if (!_.isString(value)) {
    return false
  }

  if (value.indexOf(':') > -1) {
    const elements = value.split(':')
    if (elements.length === 2) {
      return isValidCidr(elements[0]) && isValidPort(elements[1])
    } else {
      // Multiple ':' characters in value
      return false
    }
  } else {
    return isValidCidr(value)
  }
}

let isValidCidrWithPortRange = (value) => {
  if (!_.isString(value)) {
    return false
  }

  if (value.indexOf(':') > -1) {
    const elements = value.split(':')
    if (elements.length === 2) {
      return isValidCidr(elements[0]) && (isValidPort(elements[1]) || isValidPortRange(elements[1]))
    } else {
      // Multiple ':' characters in value
      return false
    }
  } else {
    return isValidCidr(value)
  }
}

let isValidHostname = (value) => {
  if (!_.isString(value) || value.length > 255) {
    return false
  }

  const hostnameElementRegex = /(?!-)[a-zA-Z\d-]{1,63}$/
  const hostnameElements = value.split('.')

  for (let i = 0; i < hostnameElements.length; i++) {
    if (!hostnameElementRegex.test(hostnameElements[i])) {
      return false
    }
  }

  return true
}

let isValidFQDN = (value) => {
  const regexp = /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i
  return regexp.test(value)
}

let isValidPolicyObjectOrGroup = (value) => {
  const regexp = /(OBJ|GRP)\(\d+\)/
  return regexp.test(value)
}

let isValidDomainWildcard = (value) => {
  if (!_.isString(value)) {
    return false
  }

  if (value.substring(0, 2) === '*.') {
    return isValidHostname(value.substring(2))
  }

  return false
}

let maxLength = (value, limit) => {
  return !(typeof value === 'string' && value.length > limit)
}

export {
  nameRules,
  emailRules,
  numberRules,
  passwordRules,
  requiredField,
  maxCharCount,
  isValidMacAddress,
  isValidEmail,
  isValidUrl,
  isValidPort,
  isValidPortRange,
  isValidPortList,
  isValidVlan,
  isValidSwitchPortVlan,
  isValidIpAddress,
  isValidCidr,
  isValidCidrWithPort,
  isValidCidrWithPortRange,
  isValidHostname,
  isValidNonNegativeInteger,
  isValidDomainWildcard,
  isValidFQDN,
  isValidPolicyObjectOrGroup,
  maxLength
}
