
import { genericInnerStyle, genericOuterStyle, widthHeightStyle } from './shared/generic-style'

let commonStyles = {
  computed: {
    logoStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...genericInnerStyle(this.config),
          ...widthHeightStyle(this.config),
          'height': this.config.height,
          'width': this.config.width
        }
        return style
      } else {
        return {
          'height': this.config.height + 'px',
          'width': this.config.width + 'px'
        }
      }
    },
    logoContainerStyle () {
      if (this.config.version === 'v1') {
        const style = {
          ...genericOuterStyle(this.config)
        }
        return style
      } else {
        return {}
      }
    }
  }
}

export default commonStyles
