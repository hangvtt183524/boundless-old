<template lang="pug">
  .page-component.loader-component(
    @click.stop="selectItem",
    :class="selectedClass",
    :style="loaderStyle"
    data-title="Loader"
  )
    font-awesome-icon(
      :icon="spinnerIcon"
      class="fa-spin"
    )
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/loader'
import selectedItemMixin from '../mixins/selected-item-mixin'

export default {
  props: ['index', 'config', 'selectedItem', 'component'],
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin
  ],
  computed: {
    loaderWrapperStyle () {
      return {
        width: '1em',
        margin: '0 auto'
      }
    }
  }
}
</script>
