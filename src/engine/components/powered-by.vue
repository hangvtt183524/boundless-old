<template lang="pug">
  .powered-by
    .page-component.powered-by-component
      span.text-after-icon(
        :style="iconAfterStyle"
      ) {{translated.title}}
      img(
        :src="computedImgSrc"
        class="poweredByLogo"
      )
</template>

<script>
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/button'
import translationMixin from '../mixins/translation-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang'],
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  computed: {
    computedImgSrc () {
      return this.config.logo.config.src.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
    }
  }
}
</script>
