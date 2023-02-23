<template lang="pug">
  .btnWrapper(:style="btnWrapperStyle")
    button.page-component.btn.btn-login-option(
      :style="btnStyle"
      @click="onClick"
      :disabled="disabled"
    )
      .content-wrapper-text(v-show="!loading")
        span.icon(v-if="config.showIcon" :style="iconStyle")
          font-awesome-icon(:icon="socialIcon")
        span.title(
          :style="buttonTextStyle"
        ) {{translated.title}}
      .content-wrapper-icon(v-show="loading")
        font-awesome-icon(icon="spinner", spin)
</template>

<script>
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/button'
import translationMixin from '../mixins/translation-mixin'

export default {
  props: ['index', 'config', 'loading', 'disabled', 'lang', 'defaultLang'],
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  methods: {
    onClick () {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  },
  computed: {
    buttonTextStyle () {
      return {
        ...this.textStyle,
        ...this.iconAfterStyle
      }
    }
  }
}
</script>
