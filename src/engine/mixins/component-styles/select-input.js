import typographyStyle from './shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    selectInputStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...typographyStyle(this.config),
          ...genericInnerStyle(this.config),
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
          'color': this.config.color
        }
      }
    },
    selectInputLabelStyle () {
      if (this.config.version === 'v1') {
        const style = {
          'text-shadow': this.config.textShadow.x + 'px ' +
            this.config.textShadow.y + 'px ' +
            this.config.textShadow.blur + 'px ' +
            this.config.textShadow.color.hex
        }
        const shadow = this.config.textShadow
        if (shadow.x || shadow.y || shadow.blur) {
          return style
        }
      } else {
        return {}
      }
    },
    selectInputContainerStyle () {
      if (this.config.version === 'v1') {
        let style = {
          ...genericOuterStyle(this.config)
          // 'background-color': 'rgba(' + [this.config.backgroundColor.rgba.r, this.config.backgroundColor.rgba.g, this.config.backgroundColor.rgba.b, this.config.backgroundColor.rgba.a].join(',') + ')',
          // 'margin': this.marginValue,
          // 'padding': this.paddingValue,
          // 'border-radius': this.config.border.radius + 'px',
          // 'border-style': this.config.border.style ? this.config.border.style : 'solid',
          // 'border-width': this.config.border.width + 'px',
          // 'border-color': 'rgba(' + [this.config.border.color.rgba.r, this.config.border.color.rgba.g, this.config.border.color.rgba.b, this.config.border.color.rgba.a].join(',') + ')'
        }
        // if (this.config.position.type.value !== 'static') {
        //   style.position = this.config.position.type.value
        //   style.top = this.config.position.top + 'px'
        //   style.left = this.config.position.left + 'px'
        //   style.bottom = this.config.position.bottom + 'px'
        //   style.right = this.config.position.right + 'px'
        // }
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
