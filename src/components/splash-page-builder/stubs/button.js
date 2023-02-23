import genericStyle from './shared/generic-style'
import typography from './shared/typography'

export default {
  version: 'v1',
  ...genericStyle,
  ...typography,
  textAlignment: 'left',
  blockAlignment: 'center',
  display: {
    text: 'flex',
    value: 'flex'
  },
  translation: {
    default: {
      title: 'button'
    }
  },
  icon: '',
  showIcon: false,
  wrapText: true,
  width: '200px',
  height: 'auto',
  backgroundColor: {
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 0.6
    },
    hex: '#000000'
  },
  margin: {
    top: '0px',
    right: '0px',
    bottom: '15px',
    left: '0px'
  },
  padding: {
    top: '6px',
    right: '12px',
    bottom: '6px',
    left: '12px'
  }
}
