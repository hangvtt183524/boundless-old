<template lang="pug">
  .page-component.mb-2(
    @click.prevent.stop="selectItem"
    :class="selectedClass"
    :data-title="$t('builder.link')"
    style="min-width: 60px; min-height: 20px;"
  )
    a(
      href="#"
      :style="linkStyle"
      :class="wrapClass"
    )
      span(
        :style="textStyle"
      )
        span(
          v-once
          ref="contentEditable"
          @blur="updateTitle"
          @input="updateTitle"
        ) {{ translated.title }}
    .action-block(v-if="!disableRemove && !config.disableRemove")
      .action.remove-action(@click.stop.prevent="removeInput")
        font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/link'
import selectedItemMixin from '../mixins/selected-item-mixin'
import selectedItemWatchTextMixin from '../mixins/selected-item-watch-text-mixin'
import removeItemMixin from '../mixins/remove-item-mixin'
import translationMixin from '../mixins/translation-mixin'

export default {
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
    selectedItemWatchTextMixin,
    removeItemMixin,
    translationMixin
  ],
  props: {
    index: {
      type: Number,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    lang: {
      type: String
    },
    defaultLang: {
      type: String
    },
    selectedItem: {
      required: true
    },
    component: {
      type: Object,
      required: true
    },
    selectedPage: {
      type: Object,
      required: true
    },
    pageConfig: {
      type: Object,
      required: true
    },
    disableRemove: {
      type: Boolean,
      default: false
    }
  }
}
</script>
