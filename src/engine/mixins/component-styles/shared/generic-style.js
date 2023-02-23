
export function marginValue (config) {
  let margin = config.margin
  if (config.version === 'v1') {
    return `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`
  } else {
    return `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
  }
}
export function paddingValue (config) {
  let padding = config.padding
  if (config.version === 'v1') {
    return `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`
  } else {
    return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
  }
}

export function genericInnerStyle (config) {
  // let toCheckKeys = ['padding', 'border', 'boxShadow', 'backgroundColor']

  // toCheckKeys.forEach(checkKey => {
  //   if (!config[checkKey]) {
  //     console.error('config key is not available')
  //     console.log('details are', config, checkKey)
  //     console.trace()
  //   }
  // })

  // try {
  let bkColor = config.backgroundColor
  const style = {
    'box-shadow': ((config.boxShadow.type === 'inside') ? 'inset ' : '') +
      config.boxShadow.x + 'px ' +
      config.boxShadow.y + 'px ' +
      config.boxShadow.blur + 'px ' +
      config.boxShadow.spread + 'px ' +
      config.boxShadow.color.hex,
    'padding': paddingValue(config),
    'border-radius': config.border.radius + 'px',
    'border-style': config.border.style ? config.border.style : 'solid',
    'border-width': config.border.width + 'px',
    'border-color': 'rgba(' + [config.border.color.rgba.r, config.border.color.rgba.g, config.border.color.rgba.b, config.border.color.rgba.a].join(',') + ')',
    'background-color': `rgba(${bkColor.rgba.r}, ${bkColor.rgba.g}, ${bkColor.rgba.b}, ${bkColor.rgba.a})`
  }
  return style
  // } catch (error) {
  //   console.error(error)
  // }
}

export function genericOuterStyle (config) {
  // let toCheckKeys = ['margin', 'position', 'blockAlignment']

  // toCheckKeys.forEach(checkKey => {
  //   if (!config[checkKey]) {
  //     console.error('config key is not available')
  //     console.log('details are', config, checkKey)
  //     console.trace()
  //   }
  // })

  // try {
  const style = {
    'margin': marginValue(config),
    'display': config.display.value
  }
  if (config.position.type.value !== 'static') {
    style.position = config.position.type.value
    style.top = config.position.top
    style.left = config.position.left
    style.bottom = config.position.bottom
    style.right = config.position.right
  }
  if (config.blockAlignment === 'left') {
    style['align-items'] = 'flex-start'
  } else if (config.blockAlignment === 'right') {
    style['align-items'] = 'flex-end'
  } else {
    style['align-items'] = 'center'
  }
  return style
  // } catch (error) {
  //   console.error(error)
  // }
}

export function widthHeightStyle (config) {
  return {
    'height': config.height,
    'width': config.width
  }
}
