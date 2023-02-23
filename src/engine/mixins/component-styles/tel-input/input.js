import typographyStyle from '../shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from '../shared/generic-style'

let commonStyles = {
  computed: {
    inputStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...typographyStyle(this.config),
          ...genericInnerStyle(this.config)
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
          'padding': this.paddingValue
        }
      }
    },
    inputContainerStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...genericOuterStyle(this.config),
          ...widthHeightStyle(this.config)
        }
        return style
      } else {
        return {
          'margin': this.marginValue
        }
      }
    }
  }
}

export default commonStyles
