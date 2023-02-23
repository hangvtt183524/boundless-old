import genericStyle from './shared/generic-style'
import typography from './shared/typography'

export default {
  version: 'v1',
  options: [
    {
      translation: {
        default: {
          label: 'Option 1'
        }
      },
      value: 1
    },
    {
      translation: {
        default: {
          label: 'Option 2'
        }
      },
      value: 2
    },
    {
      translation: {
        default: {
          label: 'Option 3'
        }
      },
      value: 3
    }
  ],
  ...genericStyle,
  ...typography,
  height: '38px',
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
  },
  display: {
    text: 'block',
    value: 'value'
  },
  fieldName: 'field_name',
  translation: {
    default: {
      placeholder: 'Select an option',
      label: 'Label'
    }
  },
  showLabel: false,
  textAlignment: 'left',
  backgroundColor: {
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 0.6
    },
    hex: '#000000'
  },
  wrapText: true,
  blockAlignment: 'center',
  labelMargin: {
    top: '0px',
    right: '0px',
    bottom: '8px',
    left: '0px'
  },
  labelTextAlignment: 'left',
  labelFontFamily: 'Montserrat',
  labelColor: {
    rgba: {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    },
    hex: '#ffffff'
  },
  labelFontSize: '16px',
  labelFontStyle: {
    bold: false,
    italic: false,
    underline: false
  },
  labelFontWeight: 500,
  labelBackgroundColor: {
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    },
    hex: '#000000'
  }
}
