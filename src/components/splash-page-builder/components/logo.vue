<template lang="pug">
  .logo-component.page-component.page-form(
    :class="selectedClass",
    @click.stop="selectItem",
    :data-title="$t('builder.logo')"
    :style="logoContainerStyle"
  )
    img(:src="computedImgSrc", :style="logoStyle")
    .action-block
      .action.remove-action(@click.stop.prevent="removeLogo")
        font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/logo'
import selectedItemMixin from '../mixins/selected-item-mixin'
import removeItemMixin from '../mixins/remove-item-mixin'

export default {
  props: ['index', 'pageConfig', 'config', 'selectedItem', 'component', 'selectedPage'],
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
    removeItemMixin
  ],
  computed: {
    computedImgSrc () {
      return this.config.src.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
    }
  }
}
</script>
