import genericStyle from './shared/generic-style'
import typography from './shared/typography'

export default {
  version: 'v1',
  ...genericStyle,
  ...typography,
  display: {
    text: 'block',
    value: 'value'
  },
  margin: {
    top: '0px',
    right: '0px',
    bottom: '20px',
    left: '0px'
  },
  translation: {
    default: {
      title: 'Heading Title',
      links: []
    }
  },
  lineHeight: '1.2em',
  linkColor: {
    rgba: {
      r: 0,
      g: 123,
      b: 255,
      a: 1
    },
    hex: '#007bff'
  },
  fontSize: '32px',
  wrapText: true,
  blockAlignment: 'center'
}
