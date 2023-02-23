<template lang="pug">
  .form-group.page-component(
    :class="selectedClass",
    @click.stop.prevent="selectItem",
    :data-title="checkboxTitle"
    :style="termsContainerStyle"
  )
    .wrapper
      .form-check
        input.form-check-input(type="checkbox", :id="index")
        label.form-check-label(
          :for="index"
          :class="wrapClass"
          :style="termsCheckStyle"
        )
          span(
            :style="textStyle"
          )
            span(
              v-once
              v-html="parsedLabel"
              @blur="updateLabel"
              @input="updateLabel"
              ref="contentEditable"
            )
    .action-block(v-if="!disableRemove && !config.disableRemove")
        .action.remove-action(@click.stop.prevent="removeInput")
          font-awesome-icon(:icon="timesCircleIcon")
</template>

<script>
import commonStyles from '../../../engine/mixins/component-common-styles'
import componentStyles from '../../../engine/mixins/component-styles/terms-checkbox'
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
    disableRemove: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    parsedLabel: function (newValue) {
      if (document.activeElement.tagName.toLowerCase() === 'iframe' && !this.selectedItem.updatedByBuildLink) {
        return
      }
      this.selectedItem.updatedByBuildLink = false
      this.$refs.contentEditable.innerHTML = newValue
    }
  },
  computed: {
    parsedLabel () {
      let newLabel = this.translated.label
      newLabel = newLabel.replace(/<([^>]+)>/g, `<a class="link" href="#" style="color: rgba(${this.config.linkColor.rgba.r}, ${this.config.linkColor.rgba.g}, ${this.config.linkColor.rgba.b}, ${this.config.linkColor.rgba.a})">$1</a>`)
      return newLabel
    },
    checkboxTitle () {
      const fieldName = this.config.fieldName
      return fieldName === 'marketing_consent' ? this.$t('builder.marketingCheckboxTitle') : this.$t('builder.termsCheckboxTitle')
    }
  },
  methods: {
    updateLabel (event) {
      if (!event || !event.target) {
        return
      }
      var updatedLabel = event.target.innerHTML
      updatedLabel = updatedLabel.replace(/<a[^>]*>/g, '<')
      updatedLabel = updatedLabel.replace(/<\/\s*a>/g, '>')
      updatedLabel = updatedLabel.replace(/&nbsp;/gi, ' ')
      updatedLabel = updatedLabel.replace(/[<]br[^>]*[>]/gi, '')
      this.translated.label = updatedLabel
    }
  }
}
</script>
