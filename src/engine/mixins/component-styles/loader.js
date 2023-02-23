import typographyStyle from './shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    loaderStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...typographyStyle(this.config),
          ...genericInnerStyle(this.config),
          ...genericOuterStyle(this.config),
          ...widthHeightStyle(this.config)
        }
        return style
      } else {
        return {
          'text-align': this.config.textAlignment,
          'font-family': this.config.fontFamily,
          'font-weight': this.config.fontWeight,
          'background-color': 'rgba(' + [this.config.backgroundColor.rgba.r, this.config.backgroundColor.rgba.g, this.config.backgroundColor.rgba.b, this.config.backgroundColor.rgba.a].join(',') + ')',
          'font-size': this.config.fontSize + 'px',
          'color': this.config.color,
          'margin': this.marginValue
        }
      }
    },
    spinnerIcon () {
      switch (this.config.loaderType) {
        case 'fas fa-spinner fa-spin':
          return ['fas', 'spinner']
        case 'fas fa-circle-notch fa-spin':
          return ['fas', 'circle-notch']
        case 'fas fa-sync fa-spin':
          return ['fas', 'sync']
      }
      return ['fas', 'spinner']
    }
  }
}

export default commonStyles
