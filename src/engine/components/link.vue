<template lang="pug">
  .form-group.page-component
    .link-container(
      :style="linkStyle"
    )

      a.mb-2(
        :style="linkStyle"
        :href="linkHref"
        :class="wrapClass"
        :target="(link && link.type === 'external_link') ? '_blank' : ''"
        @click="onClick"
      )
        span(
          :style="textStyle"
        ) {{ translated.title }}

    modal(
      v-if="link.type === 'modal'"
      :show="modalVisible"
      @close="modalVisible = false"
    )
      span(slot="modal-title") {{ link.title }}
      div(v-html="link.content")

</template>

<script>
import modal from './modal'
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/link'
import translationMixin from '../mixins/translation-mixin'

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
  data: function () {
    return {
      modalVisible: false
    }
  },
  mounted () {
    // let vm = this
    // document.removeEventListener('click', this.onClick, false)
    // document.addEventListener('click', this.onClick, false)
  },
  computed: {
    link () {
      return this.config.link
    },
    linkHref () {
      if (this.link && this.link.type === 'external_link') {
        return this.link.externalUrl
      } else if (this.link && this.link.type === 'internal_link') {
        return `#/${this.link.internalPage}`
      } else {
        return '#'
      }
    }
  },
  methods: {
    onClick () {
      if (this.config.link && this.config.link.type === 'modal') {
        this.modalVisible = true
      }
    }
  }
}
</script>
