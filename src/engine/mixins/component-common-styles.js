
let commonStyles = {
  computed: {
    timesCircleIcon () {
      return ['fas', 'times-circle']
    },
    textStyle () {
      if (this.config.version === 'v1') {
        const shadow = this.config.textShadow
        if (shadow.x || shadow.y || shadow.blur) {
          const style = {
            'text-shadow': this.config.textShadow.x + 'px ' +
              this.config.textShadow.y + 'px ' +
              this.config.textShadow.blur + 'px ' +
              this.config.textShadow.color.hex
          }
          return style
        } else {
          return {}
        }
      } else {
        return {}
      }
    },
    labelMarginValue () {
      let margin = this.config.labelMargin
      if (this.config.version === 'v1') {
        return `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`
      } else {
        return `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
      }
    },
    marginValue () {
      let margin = this.config.margin
      if (this.config.version === 'v1') {
        return `${margin.top} ${margin.right} ${margin.bottom} ${margin.left}`
      } else {
        return `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`
      }
    },
    paddingValue () {
      let padding = this.config.padding
      if (this.config.version === 'v1') {
        return `${padding.top} ${padding.right} ${padding.bottom} ${padding.left}`
      } else {
        return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
      }
    },
    wrapClass () {
      return (this.config.wrapText || typeof this.config.wrapText === 'undefined') ? 'text-no-wrap' : 'text-truncate'
    },
    placeholderClass () {
      const config = this.config
      return {
        [config.placeholderColor + '-ph']: true,
        [`opacity${(config.placeholderOpacity || 1).toFixed(1).replace('.', '')}-ph`]: true
      }
    },
    inputLabelStyle () {
      // try {
      if (this.config.version === 'v1') {
        return {
          'text-align': this.config.labelTextAlignment,
          'font-family': this.config.labelFontFamily,
          'font-weight': this.config.labelFontWeight,
          'background-color': 'rgba(' + [this.config.labelBackgroundColor.rgba.r, this.config.labelBackgroundColor.rgba.g, this.config.labelBackgroundColor.rgba.b, this.config.labelBackgroundColor.rgba.a].join(',') + ')',
          'font-size': this.config.labelFontSize + 'px',
          'color': 'rgba(' + [this.config.labelColor.rgba.r, this.config.labelColor.rgba.g, this.config.labelColor.rgba.b, this.config.labelColor.rgba.a].join(',') + ')',
          'margin': this.labelMarginValue
        }
      } else {
        return {
          'text-align': this.config.labelTextAlignment,
          'font-family': this.config.labelFontFamily,
          'font-weight': this.config.labelFontWeight,
          'background-color': 'rgba(' + [this.config.labelBackgroundColor.rgba.r, this.config.labelBackgroundColor.rgba.g, this.config.labelBackgroundColor.rgba.b, this.config.labelBackgroundColor.rgba.a].join(',') + ')',
          'font-size': this.config.labelFontSize + 'px',
          'color': this.config.labelColor,
          'margin': this.labelMarginValue
        }
      }
      // } catch (err) {
      //   console.error(err)
      // }
    }
  },
  watch: {
  },
  methods: {
  }
}

export default commonStyles
