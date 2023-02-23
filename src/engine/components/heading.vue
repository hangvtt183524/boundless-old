<template lang="pug">
  .page-component.heading(
    :style="containerStyle"
  )
    h2(
      :style="headingStyle"
      :class="wrapClass"
    )
      span(
        :style="textStyle"
        v-html="parsedTitle"
      )
</template>

<script>
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/heading'
import translationMixin from '../mixins/translation-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang'],
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  computed: {
    parsedTitle () {
      let newTitle = this.translated.title
      let num = 0
      newTitle = newTitle.replace(/<([^>]+)>/g, (match) => {
        let matchVariable = match.slice(1, match.length - 1)
        let link = this.translated.links[num]
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
          return `<a class="modal-link link" data-type="internal" data-route="${link.internalPage}" data-cindex="${this.index}" data-index="${num++}" href="#/${link.internalPage}" style="${linkStyle}">${matchVariable}</a>`
        } else if (linkType === 'modal') {
          return `<a class="modal-link link" data-type="modal" data-cindex="${this.index}" data-index="${num++}" href="#" style="${linkStyle}">${matchVariable}</a>`
        }
      })
      return newTitle
    }
  },
  mounted () {
    // let vm = this
    document.removeEventListener('click', this.onClick, false)
    document.addEventListener('click', this.onClick, false)
  },
  methods: {
    onClick (event) {
      let vm = this
      event.stopPropagation()
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
    }
  }
}
</script>
