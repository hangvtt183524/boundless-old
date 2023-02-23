let pageBackgroundStyles = {
  computed: {
    pageBackgroundStyle () {
      let pageConfig = this.pageConfig
      let background = pageConfig.background
      let windowType = this.windowType || this.getWindowType(window.innerWidth, window.innerHeight)
      if (background && background.version === 'v1') {
        if (background.backgroundType === 'color') {
          return {
            'background-color': 'rgba(' + [background.backgroundColor.rgba.r, background.backgroundColor.rgba.g, background.backgroundColor.rgba.b, background.backgroundColor.rgba.a].join(',') + ')'
          }
        } else if (background.backgroundType === 'image') {
          const image = background.backgrounds[windowType]
          if (image) {
            const computedImage = image.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
            return {
              'background-size': background.backgroundSize,
              'background-repeat': background.backgroundRepeat,
              'background-position': background.backgroundPosition,
              backgroundImage: 'url(' + computedImage + ')'
            }
          }
        } else {
          const gradient = background.gradient
          const colorStops = gradient.gradientColors
          let colorStopStr = ''
          colorStops.map(color => {
            colorStopStr += `, rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`
          })
          const style = {
            'background-image': `linear-gradient(to ${gradient.gradientDirection}${colorStopStr})`
          }
          return style
        }
      } else { // v0
        if (pageConfig.backgroundType === 'color') {
          return {
            'background-color': 'rgba(' + [pageConfig.backgroundColor.rgba.r, pageConfig.backgroundColor.rgba.g, pageConfig.backgroundColor.rgba.b, pageConfig.backgroundColor.rgba.a].join(',') + ')'
          }
        } else {
          let image = pageConfig.backgrounds[windowType]
          if (image) {
            return { backgroundImage: 'url(' + image + ')' }
          }
        }
      }
    }
  },
  watch: {
  },
  methods: {
  }
}

export default pageBackgroundStyles
