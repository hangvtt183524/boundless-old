export default function typographyStyle (config) {
  // let toCheckKeys = ['textAlignment', 'fontFamily', 'fontWeight', 'lineHeight', 'fontSize', 'fontStyle', 'color', 'textShadow']

  // toCheckKeys.forEach(checkKey => {
  //   if (!config[checkKey]) {
  //     console.error('config key is not available')
  //     console.log('details are', config, checkKey)
  //     console.trace()
  //   }
  // })

  // try {
  const getWindowType = (windowWidth, windowHeight) => {
    let smallLen = Math.min(windowWidth, windowHeight)
    let largeLen = Math.max(windowWidth, windowHeight)

    if (largeLen > 1024) {
      return 'desktop'
    } else if (smallLen >= 768) {
      return 'tablet'
    } else {
      return 'mobile'
    }
  }

  const getNormalizedFontSize = () => {
    // For mobile, if font size is bigger than 32px, limit it to 32px
    let fontSize = config.fontSize
    let windowType = getWindowType(window.innerWidth, window.innerHeight)
    if (windowType === 'mobile') {
      if (fontSize && fontSize.indexOf('px') > -1 && parseInt(fontSize.split('px')[0]) > 32) {
        fontSize = '32px'
      }
    }

    return fontSize
  }

  const style = {
    'text-align': config.textAlignment,
    'font-family': config.fontFamily,
    'font-weight': config.fontWeight,
    'line-height': config.lineHeight,
    'font-size': getNormalizedFontSize(),
    'font-style': config.fontStyle && config.fontStyle.italic ? 'italic' : 'unset',
    'text-decoration': config.fontStyle && config.fontStyle.underline ? 'underline' : 'unset',
    'color': 'rgba(' + [config.color.rgba.r, config.color.rgba.g, config.color.rgba.b, config.color.rgba.a].join(',') + ')'
  }
  if (config.fontStyle && config.fontStyle.bold) {
    style['font-weight'] = 'bold'
  }
  const shadow = config.textShadow
  if (shadow && (shadow.x || shadow.y || shadow.blur)) {
    style['text-shadow'] = config.textShadow.x + 'px ' +
      config.textShadow.y + 'px ' +
      config.textShadow.blur + 'px ' +
      config.textShadow.color.hex
  }
  return style
  // } catch (error) {
  //   console.error(error)
  // }
}
