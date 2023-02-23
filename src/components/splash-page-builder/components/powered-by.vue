<template lang="pug">
  .powered-by
    .page-component.powered-by-component(
      @click.stop="selectItem"
      :data-title="$t('builder.poweredBy')"
    )
      span.text-after-icon(
        v-once
        :style="iconAfterStyle"
        ref="contentEditable"
        @blur="updateTitle"
        @input="updateTitle"
      ) {{translated.title}}
      img(
        :src="computedImgSrc"
        class="poweredByLogo"
      )
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/button'
import selectedItemMixin from '../mixins/selected-item-mixin'
import selectedItemWatchTextMixin from '../mixins/selected-item-watch-text-mixin'
import removeItemMixin from '../mixins/remove-item-mixin'
import translationMixin from '../mixins/translation-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang', 'selectedItem', 'selectedPage', 'pageConfig', 'component', 'disableRemove'],
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
    selectedItemWatchTextMixin,
    removeItemMixin,
    translationMixin
  ],
  computed: {
    computedImgSrc () {
      return this.config.logo.config.src.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
    }
  }
}
</script>
