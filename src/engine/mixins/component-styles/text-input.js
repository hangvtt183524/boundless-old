import typographyStyle from './shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    textInputStyle () {
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
    textInputLabelStyle () {
      if (this.config.version === 'v1') {
        const style = {
          'text-align': this.config.labelTextAlignment,
          'font-family': this.config.labelFontFamily,
          'font-style': this.config.labelFontStyle && this.config.labelFontStyle.italic ? 'italic' : 'unset',
          'text-decoration': this.config.labelFontStyle && this.config.labelFontStyle.underline ? 'underline' : 'unset',
          'font-weight': this.config.labelFontWeight,
          'background-color': 'rgba(' + [this.config.labelBackgroundColor.rgba.r, this.config.labelBackgroundColor.rgba.g, this.config.labelBackgroundColor.rgba.b, this.config.labelBackgroundColor.rgba.a].join(',') + ')',
          'font-size': this.config.labelFontSize + 'px',
          'color': 'rgba(' + [this.config.labelColor.rgba.r, this.config.labelColor.rgba.g, this.config.labelColor.rgba.b, this.config.labelColor.rgba.a].join(',') + ')',
          'margin': this.labelMarginValue
        }
        if (this.config.labelFontStyle && this.config.labelFontStyle.bold) {
          style['font-weight'] = 'bold'
        }
        return style
      } else {
        let lbBkColor = this.config.labelBackgroundColor
        if (!lbBkColor) {
          lbBkColor = {
            hex: '#000000',
            rgba: {
              a: 0,
              b: 0,
              g: 0,
              r: 0
            }
          }
        }

        return {
          'text-align': this.config.labelTextAlignment,
          'font-family': this.config.labelFontFamily,
          'font-weight': this.config.labelFontWeight,
          'background-color': `rgba(${lbBkColor.rgba.r}, ${lbBkColor.rgba.g}, ${lbBkColor.rgba.b}, ${lbBkColor.rgba.a})`,
          'font-size': this.config.labelFontSize + 'px',
          'color': this.config.labelColor,
          'margin': this.config.labelMarginValue
        }
      }
    },
    textInputContainerStyle () {
      if (this.config.version === 'v1') {
        let style = {
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
