import genericStyle from './shared/generic-style'
import typography from './shared/typography'

export default {
  version: 'v1',
  ...genericStyle,
  ...typography,
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
  border: {
    radius: 4,
    color: {
      rgba: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.6
      },
      hex: '#000000'
    },
    style: 'solid',
    width: 0
  },
  labelMargin: {
    top: '0px',
    right: '0px',
    bottom: '8px',
    left: '0px'
  },
  display: {
    text: 'block',
    value: 'value'
  },
  fieldName: 'field_name',
  translation: {
    default: {
      placeholder: 'Placeholder',
      label: 'Label'
    }
  },
  showLabel: false,
  textAlignment: 'left',
  color: {
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    },
    hex: '#333333'
  },
  fieldRequired: false,
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
  labelTextAlignment: 'left',
  labelFontFamily: 'Montserrat',
  labelColor: {
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 0.6
    },
    hex: '#ffffff'
  },
  labelFontSize: '16px',
  labelFontWeight: 500,
  labelFontStyle: {
    bold: false,
    italic: false,
    underline: false
  },
  labelBackgroundColor: {
    rgba: {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    },
    hex: '#000000'
  },
  labelTextShadow: {
    x: 0,
    y: 0,
    blur: 0,
    color: {
      rgba: {
        r: 0,
        g: 0,
        b: 0,
        a: 1
      },
      hex: '#ffffff'
    }
  },
  placeholderColor: 'white',
  placeholderOpacity: 0.8
}
