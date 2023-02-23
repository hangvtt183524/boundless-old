<template lang="pug">
  .btnWrapper(:style="btnWrapperStyle")
    .page-component.btn.btn-login-option(
      @click.stop="selectItem",
      :class="wrapClass",
      :style="btnStyle"
      :data-title="$t('builder.button')"
    )
      span(v-if="config.showIcon" :style="iconStyle")
        font-awesome-icon(:icon="socialIcon")
      span.text-after-icon(
        v-once
        :style="iconAfterStyle"
        ref="contentEditable"
        @blur="updateTitle"
        @input="updateTitle"
      ) {{translated.title}}
      .action-block(v-if="!disableRemove && !config.disableRemove")
        .action.remove-action(@click.stop.prevent="removeInput")
          font-awesome-icon(:icon="timesCircleIcon")
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
  ]
}
</script>
