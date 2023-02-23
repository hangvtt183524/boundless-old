<template lang="pug">
  .page-component.heading(
    :class="selectedClass",
    @click.stop="selectItem",
    :data-title="$t('builder.heading')"
    :style="containerStyle"
    style="min-width: 60px; min-height: 20px;"
  )
    h2(
      :style="headingStyle"
      :class="wrapClass"
    )
      span(
        :style="textStyle"
      )
        span(
          v-once
          v-html="parsedTitle"
          ref="contentEditable"
          @blur="updateTitle"
          @input="updateTitle"
        )
    .action-block(v-if="!disableRemove && !config.disableRemove")
      .action.remove-action(@click.stop.prevent="removeInput")
        font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/heading'
import selectedItemMixin from '../mixins/selected-item-mixin'
import selectedItemWatchHtmlMixin from '../mixins/selected-item-watch-html-mixin'
import removeItemMixin from '../mixins/remove-item-mixin'
import translationMixin from '../mixins/translation-mixin'

export default {
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
    title: {
      default: 'Text Input',
      type: String
    },
    disableRemove: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
    selectedItemWatchHtmlMixin,
    removeItemMixin,
    translationMixin
  ]
}
</script>
