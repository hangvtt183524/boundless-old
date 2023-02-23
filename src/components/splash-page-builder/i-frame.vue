<script>
import Vue from 'vue'
import i18n from '@/plugins/i18n/i18n'
let WebFont = require('webfontloader')

export default {
  render (h) {
    let customStyle = this.customStyle
    return h('iframe', {
      name: 'child',
      style: customStyle,
      on: { load: this.renderChildren }
    })
  },

  props: ['pageConfig', 'customStyle', 'isMobile'],

  mounted () {
    this.$eventHub.$on('load-fonts', fonts => {
      this.initFonts(fonts.map(font => {
        return {
          family: font,
          weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] // Load all weights for selected fonts on builder
        }
      }))
    })
  },

  beforeUpdate () {
    // freezing to prevent unnessessary Reactifiation of vNodes
    this.iApp.children = Object.freeze(this.$slots.default)
  },

  methods: {
    renderChildren () {
      const children = this.$slots.default
      const body = this.$el.contentDocument.body
      const el = document.createElement('DIV') // we will mount or nested app to this element

      let toLoadStyleSheets = [
        ['/builder/common/fontawesome/css/minimum.css'],
        ['/builder/common/styles/bootstrap.v1.css'],
        ['/builder/common/styles/base.v1.02.css'],
        ['/builder/common/styles/vue-tel-input.v1.css'],
        ['/builder/common/styles/builder.v1.05.css'],
        ['/builder/templates/basic/styles/style.v1.04.css']
      ]
      if (this.isMobile) {
        toLoadStyleSheets.push(['/builder/common/styles/mobile-scrollbar.v1.css', 'mobile-scrollbar'])
      }
      let loadedStylesCnt = 0
      let styleSheetLoadCallback = (success, linkEl) => {
        loadedStylesCnt += 1
        if (loadedStylesCnt === toLoadStyleSheets.length) {
          this.$eventHub.$emit('styles-loaded')
        }
      }
      toLoadStyleSheets.forEach(stylesheet => {
        this.addStylesheet(stylesheet[0], stylesheet[1], styleSheetLoadCallback)
      })

      body.appendChild(el)

      try {
        // get initially to load fonts
        let pageConfig = this.pageConfig
        let usedFontFamilies = []

        const addToUsedFonts = (fontFamily, fontWeight) => {
          let existingFont = usedFontFamilies.find(fontData => fontData.family === fontFamily)
          if (!existingFont) {
            // Font is being added for the first time
            existingFont = {
              family: fontFamily,
              weights: [fontWeight]
            }
            usedFontFamilies.push(existingFont)
          } else {
            // Font is already added, add weight if not added before
            if (existingFont.weights.indexOf(fontWeight) === -1) {
              existingFont.weights.push(fontWeight)
            }
          }
        }

        let pageNames = Object.keys(pageConfig.pages).filter(pN => pN !== 'defaultPage')
        pageNames.forEach(pN => {
          let pageInfo = pageConfig.pages[pN]
          let componentKeys = Object.keys(pageInfo)
          componentKeys.forEach(cK => {
            if (Array.isArray(pageInfo[cK])) {
              for (let scK = 0; scK < pageInfo[cK].length; scK++) {
                const fontFamily = pageInfo[cK][scK].config.fontFamily
                const fontWeight = pageInfo[cK][scK].config.fontWeight || 500

                addToUsedFonts(fontFamily, fontWeight)
              }
            } else {
              if (pageInfo[cK]) {
                const fontFamily = pageInfo[cK].config.fontFamily
                const fontWeight = pageInfo[cK].config.fontWeight || 500

                addToUsedFonts(fontFamily, fontWeight)
              }
            }
          })
        })

        const initialFonts = usedFontFamilies.filter(fontData => pageConfig.settings.fontFamilies.indexOf(fontData.family) !== -1)
        this.initFonts(initialFonts)

        // load rest of fonts after 5 sec
        setTimeout(() => {
          this.initFonts(pageConfig.settings.fontFamilies.map(font => {
            return {
              family: font,
              weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] // Load all weights for selected fonts on builder
            }
          }))
        }, 5000)
      } catch (err) {
        console.error(err)
      }

      const iApp = new Vue({
        name: 'iApp',
        // freezing to prevent unnessessary Reactifiation of vNodes
        data: { children: Object.freeze(children) },
        render (h) {
          return h('div', this.children)
        },
        i18n
      })

      iApp.$mount(el) // mount into iframe

      this.iApp = iApp // cache instance for later updates
    },

    addStylesheet (linkUrl, linkId, finishCallback) {
      let head = this.$el.contentDocument.head
      let linkEl = this.$el.contentDocument.createElement('link')
      linkEl.type = 'text/css'
      linkEl.rel = 'stylesheet'
      linkEl.href = linkUrl
      linkEl.id = linkId

      let sheet, cssRules
      // get the correct properties to check for depending on the browser
      if ('sheet' in linkEl) {
        sheet = 'sheet'
        cssRules = 'cssRules'
      } else {
        sheet = 'styleSheet'
        cssRules = 'rules'
      }

      var intervalId, timeoutId

      intervalId = setInterval(() => {
        if (linkEl[sheet] && linkEl[sheet][cssRules].length) {
          clearInterval(intervalId)
          clearTimeout(timeoutId)
          if (typeof finishCallback === 'function') {
            finishCallback(true, linkEl)
          }
        }
      }, 200)
      timeoutId = setTimeout(() => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        head.removeChild(linkEl)
        if (typeof finishCallback === 'function') {
          finishCallback(false, linkEl)
        }
      }, 30000)

      head.appendChild(linkEl)
    },

    addMetaTagForNoCache (httpEquiv, content) {
      let head = this.$el.contentDocument.head
      let metaEl = this.$el.contentDocument.createElement('meta')
      metaEl['http-equiv'] = httpEquiv
      metaEl.httpEquiv = httpEquiv
      metaEl['content'] = content
      head.appendChild(metaEl)
    },

    removeStylesheet (linkId) {
      let head = this.$el.contentDocument.head
      let elem = head.querySelector(`#${linkId}`)
      elem.parentNode.removeChild(elem)
    },

    initFonts (fonts) {
      let vm = this

      if (!fonts || !fonts.length) {
        return vm.$eventHub.$emit('fonts-loaded')
      }

      WebFont.load({
        google: {
          families: fonts.map(fontData => {
            return `${fontData.family}:${([...fontData.weights].sort()).join(',')}`
          })
        },
        context: frames['child'],
        active () {
          vm.$eventHub.$emit('fonts-loaded')
        },
        fontloading: function (fontFamily, fontDescription) {
          // console.log('fontloading: ' + fontFamily + ' (' + fontDescription + ')')
        },
        fontactive: function (fontFamily, fontDescription) {
          // console.log('fontactive: ' + fontFamily + ' (' + fontDescription + ')')
        },
        fontinactive: function (fontFamily, fontDescription) {
          // console.log('fontinactive: ' + fontFamily + ' (' + fontDescription + ')')
        }
      })
    }
  },
  watch: {
    isMobile (newVal) {
      if (newVal) {
        this.addStylesheet('/builder/common/styles/mobile-scrollbar.css', 'mobile-scrollbar')
      } else {
        this.removeStylesheet('mobile-scrollbar')
      }
    }
  }
}
</script>
