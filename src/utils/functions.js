import _ from 'lodash'

let isTouch = () => {
  try {
    document.createEvent('TouchEvent')
    return true
  } catch (e) {
    return false
  }
}

var flattenTree = (tree, key, collection) => {
  if (!tree[key] || tree[key].length === 0) return

  for (var i = 0; i < tree[key].length; i++) {
    var child = tree[key][i]
    collection[child.id] = child
    flattenTree(child, key, collection)
  }
}

// Sort to make sure sites are always at the end
var sortArray = (a, b) => {
  if (a.type === 'site') return 1
  else if (b.type === 'site') return -1
  else return a - b
}

var sortNodesAndChildren = (nodes) => {
  nodes.sort(sortArray)
  nodes.forEach(function (node) {
    if (node.children && node.children.length) {
      sortNodesAndChildren(node.children)
    }
  })

  return nodes
}

let stopZoomingWhenDoubleTapped = () => {
  let timeout
  let lastTap = 0
  let wrapper = document.getElementById('app')

  wrapper.addEventListener('touchend', function (e) {
    let currentTime = new Date().getTime()
    let tapLength = currentTime - lastTap

    clearTimeout(timeout)
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault()
    } else {
      timeout = setTimeout(function () {
        clearTimeout(timeout)
      }, 500)
    }
    lastTap = currentTime
  })
}

let isName = (str) => {
  return /^[a-zA-Z\s]+$/.test(str)
}

let isNumber = (str) => {
  return /^\d+$/.test(str)
}

let isDomain = (str) => {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(str)
}

let isEmail = (str) => {
  return /^(([^<>()[\]\\.,;:#\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,63}))$/.test(str)
}

let hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

let componentToHex = (c) => {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

let unescapeRegex = (value) => {
  return value.replace(/\\(.)/g, '$1')
}

let escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

let rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

let isObjectEmpty = (value) => {
  // Recursively checks if the provided object is empty, or all its elements are empty
  if (Array.isArray(value)) {
    if (value.length > 1) {
      // Even if all fields are empty, if there are more than 1 items in an array, it is considered not empty
      return false
    }

    // If array itself is empty, or all elements are empty, return true
    let empty = true
    value.forEach(arrayItem => {
      empty = empty && isObjectEmpty(arrayItem)
    })

    return empty
  } else if (typeof value === 'object' && value !== null) {
    // If dictionary itself is empty, or all keys are empty, return true
    if (_.isEmpty(value)) {
      return true
    }

    let empty = true
    for (let key of Object.keys(value)) {
      empty = empty && isObjectEmpty(value[key])
    }

    return empty
  }

  // Basic types
  return _.isNil(value) || value === ''
}

export {
  isTouch,
  stopZoomingWhenDoubleTapped,
  isName,
  isNumber,
  isDomain,
  isEmail,
  hexToRgb,
  rgbToHex,
  flattenTree,
  sortNodesAndChildren,
  unescapeRegex,
  escapeRegex,
  isObjectEmpty
}
