export const findItem = (id, currentNode) => {
  var i,
    currentChild,
    result

  if (id === currentNode.id) {
    return currentNode
  } else if (currentNode.children) {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < currentNode.children.length; i += 1) {
      currentChild = currentNode.children[i]

      // Search in the current child
      result = findItem(id, currentChild)

      // Return the result if the node has been found
      if (result !== false) {
        return result
      }
    }
  }

  // The node has not been found and we have no more options
  return false
}

export const findItemByType = (id, type, currentNode) => {
  var i,
    currentChild,
    result

  if (id === currentNode.id && currentNode.type === type) {
    return currentNode
  } else if (currentNode.children) {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < currentNode.children.length; i += 1) {
      currentChild = currentNode.children[i]

      // Search in the current child
      result = findItemByType(id, type, currentChild)

      // Return the result if the node has been found
      if (result !== false) {
        return result
      }
    }
  }

  // The node has not been found and we have no more options
  return false
}
