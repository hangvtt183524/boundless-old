import genericStyle from './shared/generic-style'
import typography from './shared/typography'

export default {
  version: 'v1',
  ...genericStyle,
  ...typography,
  margin: {
    top: '0px',
    right: '0px',
    bottom: '20px',
    left: '0px'
  },
  display: {
    text: 'block',
    value: 'value'
  },
  translation: {
    default: {
      title: 'Click here'
    }
  },
  link: {
    type: 'external_link',
    title: '', // For modal
    content: '', // For modal
    externalUrl: '',
    internalPage: ''
  },
  textAlignment: 'center',
  fontSize: '16px',
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
    underline: true
  },
  wrapText: true,
  blockAlignment: 'center'
}
