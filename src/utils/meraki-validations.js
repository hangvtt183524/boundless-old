
export const isValidVlan = (value) => {
  return ((value && /^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) < 4096) || (value.toLowerCase() === 'any'))
}

export const isValidCidr = (value) => {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(value) || (value.toLowerCase() === 'any')
}

export const isValidHostname = (value) => {
  if (value.length > 255) {
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

export const isValidL7Application = (value) => {
  return /meraki:layer7\/application\/[1-9]+/.test(value.id)
}

export const isValidL7Category = (value) => {
  return /meraki:layer7\/category\/[1-9]+/.test(value.id)
}

export const isValidUsedCount = (value) => {
  return Number.isInteger(value) && value >= 0
}
