<template lang="pug">
  .form-group.page-component.text-input(
    :class="selectedClass",
    @click.prevent.stop="selectItem",
    @focus="focused = true",
    @blur="focused = false"
    :style="textInputContainerStyle"
    :data-title="$t('builder.textInput')"
  )
    label(v-show="config.showLabel", :style="textInputLabelStyle") {{translated.label}}
    input(
      type="text",
      class="form-control",
      autocomplete="disabled",
      :placeholder="translated.placeholder",
      :style="textInputStyle"
      :class="placeholderClass"
    )
    .action-block(v-if="!disableRemove && !config.disableRemove")
      .action.remove-action(@click.stop.prevent="removeInput")
        font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/text-input'
import selectedItemMixin from '../mixins/selected-item-mixin'
import removeItemMixin from '../mixins/remove-item-mixin'
import translationMixin from '../mixins/translation-mixin'

export default {
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
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
    title: {
      default: 'Text Input',
      type: String
    },
    disableRemove: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      focused: false
    }
  },
  computed: {
    isLastInput () {
      let index = this.pageConfig.pages[this.selectedPage.configKey].children.findIndex((child) => child.id === this.component.id)
      let length = this.pageConfig.pages[this.selectedPage.configKey].children.length
      return (index === (length - 2))
    }
  }
}
</script>
