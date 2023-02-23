<template lang="pug">
  .form-group.page-component(:style="termsContainerStyle")
    .wrapper
      .form-check
        input.form-check-input(
          type="checkbox",
          :id="'terms-' + index",
          v-model="inputCheck"
          @change="triggerInput",
          @blur="$v.inputCheck.$touch()"
          :class="{'is-invalid': $v.$anyError}"
        )
        label.form-check-label(
          :for="'terms-' + index"
          :class="wrapClass"
          :style="termsCheckStyle"
        )
          span(
            :style="textStyle"
            v-html="parsedLabel"
          )
        .invalid-feedback(v-if="config.fieldRequired && !$v.inputCheck.sameAs") Field is Required
    modal(
      v-for="(link, lIndex) in (translated.links || defaultLinks)"
      v-if="link.type === 'modal'"
      :key="lIndex"
      :show="showModalIndex == lIndex && showCIndex == index"
      @close="showModalIndex = -1"
    )
      span(slot="modal-title") {{ link.title }}
      div(v-html="link.content")
</template>

<script>
import { sameAs, helpers } from 'vuelidate/lib/validators'
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/terms-checkbox'
import translationMixin from '../mixins/translation-mixin'
import modal from './modal'

export default {
  props: ['index', 'config', 'lang', 'defaultLang'],
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  components: {
    modal
  },
  data () {
    return {
      showModalIndex: -1,
      showCIndex: -1,
      inputCheck: false,
      defaultLinks: [
        {
          type: 'modal',
          title: 'Terms and Conditions',
          content: '<h2><strong>GENERAL CONDITIONS OF USE OF THE WIFI</strong></h2><h3><em>Updated: October 11, 2018</em></h3><p><br></p><p>These General Terms and Conditions of Use (hereinafter: "TOS") are up to date with the new rules from Regulation No. 2016/679 of the European Parliament and of the Council (hereinafter "RGPD") relating to the protection of Personal Data.</p><p>The TOS present the conditions of use of the wifi service (hereinafter "Wifi") from the areas covered in (to be completed) (hereinafter: "the Site").</p><p><br></p><h3><strong>Definitions</strong></h3><p>The terms defined below have the following meaning, whether used in the singular or the plural:</p><p><br></p><p> "Personal Data": refers to Article 2 of the Data Protection Act "any information relating to a natural person identified or who can be identified, directly or indirectly, by reference to an identification number or to one or more elements of its own ". Included in Personal Data are data for the identification of Users.</p><p><br></p><ul><li> "Services": means the services made available to Visitors by XXX which are the website, the mobile application and the Wifi.</li></ul><p><br></p><ul><li> "Terminal": refers to the different media by which the site, application or service Wifi will be accessible. Terminals include smartphones, tablets, microcomputers via internet (PC or Apple) and any connected / connectable object to another object as well as the Internet.</li></ul><p><br></p><ul><li> "You", "Yours", "Your", "User (s)", "Visitor (s)": means any person accessing the Services and whose Personal Data may be collected during his visit and / or connection.</li></ul><p><br></p><ul><li> "Wifi": refers to a wireless communication protocol governed by the standards of the IEEE802.11 group. It allows to connect by radio waves several computer devices (computer, router, smartphone, internet modem, etc.) within a computer network to allow the transmission of data between them.</li></ul>',
          externalUrl: '',
          internalPage: ''
        }
      ]
    }
  },
  watch: {
    '$v': {
      handler (value) {
        this.$emit('valid', {
          index: this.index,
          valid: !value.inputCheck.$invalid
        })
      },
      deep: true
    }
  },
  validations () {
    let obj = {
      inputCheck: {
        empty: (value) => {
          return (value) => !helpers.req(value)
        }
      }
    }

    if (this.config.fieldRequired) {
      obj.inputCheck.sameAs = sameAs(() => true)
    }

    return obj
  },
  computed: {
    parsedLabel () {
      // try {
      let newLabel = this.translated.label
      let num = 0
      newLabel = newLabel.replace(/<([^>]+)>/g, (match) => {
        let matchVariable = match.slice(1, match.length - 1)
        let link
        if (this.translated.links && this.translated.links[num]) {
          link = this.translated.links[num]
        } else {
          link = this.defaultLinks[0]
        }
        let linkType = link.type
        let linkColor = this.config.linkColor
        let linkStyle
        if (typeof linkColor === 'string') { // v0 template
          linkStyle = `color: ${linkColor}`
        } else { // v1 template
          linkStyle = `color: rgba(${linkColor.rgba.r}, ${linkColor.rgba.g}, ${linkColor.rgba.b}, ${linkColor.rgba.a})`
        }
        if (linkType === 'external_link') {
          return `<a class="modal-link link" target="_blank" href="${link.externalUrl}" style="${linkStyle}">${matchVariable}</a>`
        } else if (linkType === 'internal_link') {
          return `<a class="modal-link link" data-type="internal" data-route="${link.internalPage}" data-cindex="${this.index}" data-index="${num++}" href="#"  style="${linkStyle}">${matchVariable}</a>`
        } else if (linkType === 'modal') {
          return `<a class="modal-link link" data-type="modal" data-cindex="${this.index}" data-index="${num++}" href="#"  style="${linkStyle}">${matchVariable}</a>`
        }
      })
      return newLabel
      // } catch (err) {
      //   console.error(err)
      // }
    }
  },
  mounted () {
    let vm = this
    document.addEventListener('click', function (event) {
      // If the clicked element doesn't have the right selector, bail
      if (!event.target.matches) {
        event.target.matches = event.target.msMatchesSelector || event.target.webkitMatchesSelector
      }
      if (!event.target.matches('.modal-link')) return

      // Don't follow the link
      if (event.target.getAttribute('data-type') === 'modal') {
        event.preventDefault()
        vm.showModalIndex = event.target.getAttribute('data-index')
        vm.showCIndex = event.target.getAttribute('data-cindex')
      } else if (event.target.getAttribute('data-type') === 'internal') {
        vm.$router.push(event.target.getAttribute('data-route'))
      }
    }, false)

    this.$eventHub.$on('VALIDATE_INPUTS', () => {
      this.$v.inputCheck.$touch()
    })
  },
  methods: {
    triggerInput (val) {
      this.$v.inputCheck.$touch()
      this.$emit('input', this.inputCheck)
    }
  }
}
</script>

<style lang="scss">
.page-component .form-check-input.is-invalid ~ .form-check-label {
  color: inherit;
}
</style>
