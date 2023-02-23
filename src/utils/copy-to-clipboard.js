let fallbackCopyTextToClipboard = function (text) {
  var textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

let copyTextToClipboard = function (text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text)
    return
  }
  return navigator.clipboard.writeText(text).then(function () {
    console.log('Async: Copying to clipboard was successful!')
    return true
  }, function (err) {
    console.error('Async: Could not copy text: ', err)
    return false
  })
}

export default copyTextToClipboard
