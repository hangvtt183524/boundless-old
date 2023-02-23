import _ from 'lodash'
import heading from './stubs/heading'
import link from './stubs/link'
import selectInput from './stubs/select-input'
import textInput from './stubs/text-input'
import textParagraph from './stubs/text-paragraph'
import poweredByDefaultConfig from './stubs/powered-by'
function hexToRgba (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
  } : null
}

export function defaultProperty (componentName) {
  switch (componentName) {
    case 'position':
      return {
        type: {
          text: 'static',
          value: 'static'
        },
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto'
      }
    case 'border':
      return {
        radius: 0,
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
      }
    case 'fontStyle':
      return {
        bold: false,
        italic: false,
        underline: false
      }
    case 'display':
      return {
        text: 'block',
        value: 'block'
      }
    case 'boxShadow':
      return {
        x: 0,
        y: 0,
        blur: 0,
        spread: 0,
        color: {
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          },
          hex: '#ffffff'
        },
        type: 'outside'
      }
    case 'textShadow':
      return {
        x: 0,
        y: 0,
        blur: 0,
        color: {
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          },
          hex: '#ffffff'
        }
      }
    case 'borderStyles':
      return [
        'dotted',
        'dashed',
        'solid',
        'double',
        'groove',
        'ridge',
        'inset',
        'outset',
        'none',
        'hidden'
      ]
    case 'gradient':
      return {
        gradientDirection: 'left',
        gradientColors: [
          {
            rgba: {
              r: 255,
              g: 255,
              b: 255,
              a: 0.6
            },
            hex: '#ffff00'
          },
          {
            rgba: {
              r: 0,
              g: 255,
              b: 0,
              a: 1
            },
            hex: '00ff00'
          }
        ]
      }
    case 'backgroundColor':
      return {
        rgba: {
          r: 0,
          g: 0,
          b: 0,
          a: 0
        },
        hex: '#000000'
      }
  }
}

function marginPaddingConversion (prev) {
  return {
    top: `${prev.top}px`,
    right: `${prev.right}px`,
    bottom: `${prev.bottom}px`,
    left: `${prev.left}px`
  }
}

function colorConversion (prev, defaultColor) {
  if (typeof prev === 'string') {
    return {
      rgba: hexToRgba(prev),
      hex: prev
    }
  }
  return prev
}

export default function updateVersion (fromVersion, fromConfig, component, toVersion) {
  if ((fromVersion === 'v0' || fromVersion === undefined) && toVersion === 'v1') {
    switch (component) {
      case 'heading':
        return {
          ..._.cloneDeep(heading),
          margin: marginPaddingConversion(fromConfig.margin),
          padding: marginPaddingConversion(fromConfig.padding),
          title: fromConfig.title,
          textAlignment: fromConfig.textAlignment,
          fontFamily: fromConfig.fontFamily,
          fontWeight: fromConfig.fontWeight,
          color: colorConversion(fromConfig.color),
          linkColor: colorConversion(fromConfig.linkColor || '#007bff'),
          links: fromConfig.links || [],
          fontSize: `${fromConfig.fontSize}px`
        }
      case 'text-input':
      case 'email-input':
      case 'password-input':
        return {
          ..._.cloneDeep(textInput),
          margin: marginPaddingConversion(fromConfig.margin),
          padding: marginPaddingConversion(fromConfig.padding),
          labelMargin: marginPaddingConversion(fromConfig.labelMargin),
          fieldName: fromConfig.fieldName,
          placeholder: fromConfig.placeholder,
          placeholderColor: 'white',
          placeholderOpacity: 0.8,
          label: fromConfig.label,
          showLabel: fromConfig.showLabel,
          textAlignment: fromConfig.textAlignment,
          fontFamily: fromConfig.fontFamily,
          fontWeight: fromConfig.fontWeight,
          fontSize: `${fromConfig.fontSize}px`,
          fieldRequired: fromConfig.fieldRequired,
          color: colorConversion(fromConfig.color),
          backgroundColor: fromConfig.backgroundColor
        }
      case 'link':
      case 'access-link':
        return {
          ..._.cloneDeep(link),
          title: fromConfig.title,
          link: fromConfig.link,
          textAlignment: fromConfig.textAlignment,
          fontFamily: fromConfig.fontFamily,
          fontWeight: fromConfig.fontWeight,
          fontSize: `${fromConfig.fontSize}px`,
          color: colorConversion(fromConfig.color)
        }
      case 'select-input':
        return {
          ..._.cloneDeep(selectInput),
          margin: marginPaddingConversion(fromConfig.margin),
          textAlignment: fromConfig.textAlignment,
          fontFamily: fromConfig.fontFamily,
          fontWeight: fromConfig.fontWeight,
          backgroundColor: fromConfig.backgroundColor,
          fontSize: `${fromConfig.fontSize}px`,
          color: colorConversion(fromConfig.color)
        }
      case 'text-paragraph':
        return {
          ..._.cloneDeep(textParagraph),
          textAlignment: fromConfig.textAlignment,
          fontFamily: fromConfig.fontFamily,
          fontWeight: fromConfig.fontWeight,
          fontSize: `${fromConfig.fontSize}px`,
          color: colorConversion(fromConfig.color)
        }
      case 'phone-input':
      case 'tel-input':
        return {
          version: 'v1',
          placeholder: fromConfig.placeholder,
          placeholderColor: 'white',
          placeholderOpacity: 0.8,
          fieldName: fromConfig.fieldName,
          display: defaultProperty('display'),
          margin: marginPaddingConversion(fromConfig.margin),
          labelMargin: marginPaddingConversion(fromConfig.labelMargin),
          padding: marginPaddingConversion(fromConfig.padding),
          position: defaultProperty('position'),
          labelTextAlignment: fromConfig.labelTextAlignment,
          labelFontFamily: fromConfig.labelFontFamily,
          labelFontWeight: fromConfig.labelFontWeight,
          labelBackgroundColor: fromConfig.labelBackgroundColor,
          labelFontSize: `${fromConfig.labelFontSize}px`,
          labelColor: colorConversion(fromConfig.labelColor),
          color: colorConversion(fromConfig.color),
          backgroundColor: fromConfig.backgroundColor,
          border: defaultProperty('border'),
          textAlignment: fromConfig.textAlignment,
          fontFamily: fromConfig.fontFamily,
          fontWeight: fromConfig.fontWeight,
          lineHeight: '1.5em',
          fontSize: `${fromConfig.fontSize}px`,
          fontStyle: defaultProperty('fontStyle'),
          textShadow: defaultProperty('textShadow'),
          boxShadow: defaultProperty('boxShadow'),
          width: '100%',
          height: 'auto',
          aspectRatio: true,
          blockAlignment: 'center'
        }
      case 'button':
      case 'email-button':
      case 'facebook-button':
      case 'instagram-button':
      case 'google-button':
      case 'linkedin-button':
      case 'twitter-button':
      case 'submit-button':
        return {
          version: 'v1',
          blockAlignment: 'center',
          textShadow: defaultProperty('textShadow'),
          boxShadow: defaultProperty('boxShadow'),
          display: {
            text: 'flex',
            value: 'flex'
          },
          textAlignment: fromConfig.textAlignment, // v0
          fontFamily: fromConfig.fontFamily, // v0
          fontWeight: fromConfig.fontWeight, // v0
          lineHeight: '1.5em',
          backgroundColor: fromConfig.backgroundColor, // v0
          fontSize: `${fromConfig.fontSize}px`, // v0
          fontStyle: defaultProperty('fontStyle'),
          color: colorConversion(fromConfig.color), // v0
          margin: marginPaddingConversion(fromConfig.margin), // v0
          padding: marginPaddingConversion(fromConfig.padding),
          border: {
            ...defaultProperty('border'),
            radius: 4
          },
          position: defaultProperty('position'),
          title: fromConfig.title,
          icon: fromConfig.icon,
          showIcon: fromConfig.showIcon,
          wrapText: true,
          width: '200px',
          height: 'auto',
          aspectRatio: true
        }
      case 'loader':
        return {
          version: 'v1',
          textShadow: defaultProperty('textShadow'),
          boxShadow: defaultProperty('boxShadow'),
          display: defaultProperty('display'),
          textAlignment: fromConfig.textAlignment, // v0
          fontFamily: fromConfig.fontFamily, // v0
          fontWeight: fromConfig.fontWeight, // v0
          lineHeight: '1em',
          backgroundColor: fromConfig.backgroundColor, // v0
          fontSize: `${fromConfig.fontSize}px`, // v0
          fontStyle: defaultProperty('fontStyle'),
          color: colorConversion(fromConfig.color), // v0
          margin: marginPaddingConversion(fromConfig.margin), // v0
          padding: marginPaddingConversion(fromConfig.padding),
          border: defaultProperty('border'),
          position: defaultProperty('position'),
          loaderType: fromConfig.loaderType,
          wrapText: true,
          blockAlignment: 'center',
          width: '100%',
          height: 'auto',
          aspectRatio: true
        }
      case 'logo':
        return {
          version: 'v1',
          margin: marginPaddingConversion(fromConfig.margin),
          padding: marginPaddingConversion(fromConfig.padding),
          blockAlignment: 'center',
          display: {
            text: 'flex',
            value: 'flex'
          },
          position: defaultProperty('position'),
          width: parseFloat(fromConfig.width).toFixed(1) + 'px',
          height: parseFloat(fromConfig.height).toFixed(1) + 'px',
          aspectRatio: fromConfig.aspectRatio,
          backgroundColor: defaultProperty('backgroundColor'),
          boxShadow: defaultProperty('boxShadow'),
          border: defaultProperty('border'),
          src: fromConfig.src,
          title: fromConfig.title
        }
      case 'terms-checkbox':
        return {
          version: 'v1',
          margin: marginPaddingConversion(fromConfig.margin),
          padding: marginPaddingConversion(fromConfig.padding),
          border: defaultProperty('border'),
          display: defaultProperty('display'),
          position: defaultProperty('position'),
          label: fromConfig.label,
          textAlignment: fromConfig.textAlignment, // v0
          fontFamily: fromConfig.fontFamily, // v0
          fontWeight: fromConfig.fontWeight, // v0
          lineHeight: '1.5em',
          fontSize: `${14}px`, // v0
          fontStyle: defaultProperty('fontStyle'),
          color: colorConversion(fromConfig.color), // v0
          linkColor: colorConversion(fromConfig.linkColor),
          backgroundColor: defaultProperty('backgroundColor'),
          textShadow: defaultProperty('textShadow'),
          boxShadow: defaultProperty('boxShadow'),
          wrapText: true,
          fieldRequired: fromConfig.fieldRequired,
          fieldName: fromConfig.fieldName,
          width: '100%',
          height: 'auto',
          aspectRatio: true,
          blockAlignment: 'center'
        }
      default:
        return fromConfig
    }
  } else {
    switch (component) {
      case 'text-input':
      case 'email-input':
      case 'password-input':
      case 'phone-input':
      case 'tel-input':
        const copiedConfig = _.cloneDeep(fromConfig)
        if (!copiedConfig.placeholderColor) {
          copiedConfig.placeholderColor = 'white'
        }
        if (!copiedConfig.placeholderOpacity) {
          copiedConfig.placeholderOpacity = 0.8
        }
        return copiedConfig
      default:
        return fromConfig
    }
  }
}

export function setDefaultLanguageAndPoweredByOption (config) {
  config.settings.defaultLanguage = config.settings.defaultLanguage || 'en_US'
  config.settings.supportLanguages = config.settings.supportLanguages || ['en_US', 'fr_FR']
  config.settings.showLanguageSelectionBar = config.settings.showLanguageSelectionBar || false
  config.settings.poweredBy = config.settings.poweredBy || {
    component: 'powered-by',
    config: poweredByDefaultConfig
  }
}
