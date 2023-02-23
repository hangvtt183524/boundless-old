
export function ipAddressMask (value) {
  if (!value) {
    return value
  }

  let ipValue = ''
  let currentSegment = ''
  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    if (/\d/.test(char)) {
      // Current char is a digit
      if (char === '0' && currentSegment === '0') {
        // Do not allow multiple zeroes
        continue
      }

      if (parseInt(currentSegment + char) > 255) {
        // Addition of next digit makes it larger than max ip segment. Start a new segment

        // If max number of segments reached, break out of the loop
        if (ipValue.split('.').length === 4) {
          continue
        }

        ipValue += ('.' + char)
        currentSegment = char
      } else {
        // Append digit to current segment
        currentSegment += char
        ipValue += char
      }
    } else if (char === '.') {
      // Ignore . character when there is not current segment
      if (currentSegment) {
        // Ending current segment, reset it

        // If max number of segments reached, break out of the loop
        if (ipValue.split('.').length === 4) {
          continue
        }

        ipValue += char
        currentSegment = ''
      }
    }
  }

  return ipValue.split('')
}

export function subnetMask (value) {
  if (!value) {
    return value
  }

  if (value.indexOf('/') === -1) {
    // On the ip section still
    return ipAddressMask(value)
  } else {
    const [ipSection, subnetSection] = value.split('/')
    const ipValue = ipAddressMask(ipSection).join('')

    let subnetValue = ''
    for (let i = 0; i < subnetSection.length; i++) {
      const char = subnetSection[i]
      if (char === '0' && !subnetValue) {
        // Do not allow leading zeroes
        continue
      }

      if (/\d/.test(char)) {
        if (parseInt(subnetValue + char) <= 32) {
          subnetValue += char
        }
      }
    }

    return `${ipValue}/${subnetValue}`.split('')
  }
}
