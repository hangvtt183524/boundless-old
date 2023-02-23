import typographyStyle from './shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    linkStyle () {
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
          'font-size': this.config.fontSize + 'px',
          'color': this.config.color,
          'margin': this.marginValue,
          'padding': this.paddingValue
        }
      }
    }
  }
}

export default commonStyles
