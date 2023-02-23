import typographyStyle from './shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    paragraphStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...typographyStyle(this.config),
          // 'text-align': this.config.textAlignment,
          // 'font-family': this.config.fontFamily,
          // 'font-weight': this.config.fontWeight,
          // 'font-size': this.config.fontSize,
          // 'line-height': this.config.lineHeight,
          // 'font-style': this.config.fontStyle && this.config.fontStyle.italic ? 'italic' : 'unset',
          // 'text-decoration': this.config.fontStyle && this.config.fontStyle.underline ? 'underline' : 'unset',
          // 'color': 'rgba(' + [this.config.color.rgba.r, this.config.color.rgba.g, this.config.color.rgba.b, this.config.color.rgba.a].join(',') + ')',
          ...genericInnerStyle(this.config),
          ...genericOuterStyle(this.config),
          ...widthHeightStyle(this.config)
          // 'border-radius': this.config.border.radius + 'px',
          // 'border-style': this.config.border.style ? this.config.border.style : 'solid',
          // 'border-width': this.config.border.width + 'px',
          // 'border-color': 'rgba(' + [this.config.border.color.rgba.r, this.config.border.color.rgba.g, this.config.border.color.rgba.b, this.config.border.color.rgba.a].join(',') + ')'
        }
        // if (this.config.fontStyle && this.config.fontStyle.bold) {
        //   style['font-weight'] = 'bold'
        // }
        return style
      } else {
        return {
          'text-align': this.config.textAlignment,
          'font-family': this.config.fontFamily,
          'font-weight': this.config.fontWeight,
          'font-size': this.config.fontSize + 'px',
          'color': this.config.color
        }
      }
    }
  }
}

export default commonStyles
