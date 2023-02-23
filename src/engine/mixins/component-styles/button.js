import typographyStyle from './shared/typography'
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    btnStyle () {
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
          'margin': this.marginValue
        }
      }
    },
    btnWrapperStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...genericOuterStyle(this.config),
          ...widthHeightStyle(this.config),
          'width': '100%',
          // 'display': 'flex',
          'flex-direction': 'column'
        }
        return style
      } else {
        return {}
      }
    },
    socialIcon () {
      switch (this.config.icon) {
        case 'fas fa-envelope':
          return ['fas', 'envelope']
        case 'fab fa-facebook-f':
          return ['fab', 'facebook-f']
        case 'fab fa-instagram':
          return ['fab', 'instagram']
        case 'fab fa-twitter':
          return ['fab', 'twitter']
        case 'fab fa-linkedin':
          return ['fab', 'linkedin']
        case 'fab fa-google':
          return ['fab', 'google']
      }
    },
    iconStyle () {
      let style = {
        width: '20px',
        height: '20px',
        display: 'inline-block',
        verticalAlign: 'middle'
      }
      if (this.socialIcon[1] === 'facebook-f') {
        style.paddingRight = '5px'
      }
      return style
    },
    iconAfterStyle () {
      return {
        verticalAlign: 'middle'
      }
    }
  }
}

export default commonStyles
