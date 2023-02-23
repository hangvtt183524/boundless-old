<template lang="pug">
  .form-group.page-component.text-input(
    :class="{selectedClass, wrapClass}",
    @click.prevent.stop="selectItem",
    @focus="focused = true",
    @blur="focused = false"
    :data-title="title"
    :style="selectInputContainerStyle"
  )
    label(v-show="config.showLabel" :style="inputLabelStyle") {{translated.label}}
    select(
      type="text",
      class="form-control",
      autocomplete="disabled",
      :placeholder="translated.placeholder",
      :style="selectInputStyle"
    )
      option(disabled selected value) {{ translated.placeholder }}
      option(v-for="option in config.options", :value="option") {{ option }}
    .action-block(v-if="!disableRemove && !config.disableRemove")
      .action.remove-action(@click.stop.prevent="removeInput")
        font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/select-input'
import selectedItemMixin from '../mixins/selected-item-mixin'
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
  data () {
    return {
      focused: false
    }
  },
  mixins: [
    commonStyles,
    componentStyles,
    selectedItemMixin,
    translationMixin
  ],
  computed: {
    isLastInput () {
      let index = this.pageConfig.pages[this.selectedPage.configKey].children.findIndex((child) => child.id === this.component.id)
      let length = this.pageConfig.pages[this.selectedPage.configKey].children.length

      return (index === (length - 2))
    }
  },
  methods: {
    removeInput () {
      let index = this.pageConfig.pages[this.selectedPage.configKey].children.findIndex((child) => child.id === this.component.id)

      if (index > -1) {
        this.pageConfig.pages[this.selectedPage.configKey].children.splice(index, 1)
      }
    }
  }
}
</script>
