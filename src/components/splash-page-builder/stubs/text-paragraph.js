import genericStyle from './shared/generic-style'
import typography from './shared/typography'

export default {
  version: 'v1',
  ...genericStyle,
  ...typography,
  margin: {
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px'
  },
  display: {
    text: 'block',
    value: 'value'
  },
  translation: {
    default: {
      title: 'Paragraph'
    }
  },
  fontSize: '16px',
  fontWeight: 300,
  color: {
    rgba: {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    },
    hex: '#FFFFFF'
  },
  fontStyle: {
    bold: false,
    italic: false,
    underline: false
  },
  wrapText: true,
  blockAlignment: 'center'
}
