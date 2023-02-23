<template lang="pug">
  .form-group.page-component.select-input(
    :style="selectInputContainerStyle"
  )
    label(v-show="config.showLabel", :style="inputLabelStyle") {{translated.label}}
    select(
      type="text"
      :class="inputClass"
      :placeholder="translated.placeholder"
      :style="selectInputStyle"
      v-model="inputText"
      @input="triggerInput"
      @blur="$v.inputText.$touch()"
    )
      option(disabled value) {{ translated.placeholder }}
      option(v-for="option in config.options", :value="option.value") {{ translateOption(option) }}
    .invalid-feedback(v-if="config.fieldRequired && !$v.inputText.required") Field is Required
</template>

<script>
import { required, helpers } from 'vuelidate/lib/validators'
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/select-input'
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
      type: String,
      default: 'en_US'
    },
    defaultLang: {
      type: String,
      default: 'en_US'
    },
    pageConfig: {
      type: Object
    },
    title: {
      default: 'Text Input',
      type: String
    },
    type: {
      default: 'text',
      type: String
    },
    value: [String, Number]
  },
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  data () {
    return {
      focused: false,
      inputText: this.value
    }
  },
  watch: {
    '$v': {
      handler (value) {
        this.$emit('valid', {
          index: this.index,
          valid: !value.inputText.$anyError
        })
      },
      deep: true
    }
  },
  validations () {
    let obj = {
      inputText: {
        empty: (value) => {
          return (value) => !helpers.req(value)
        }
      }
    }

    if (this.config.fieldRequired) {
      obj.inputText.required = required
    }

    return obj
  },
  mounted () {
    this.$eventHub.$on('VALIDATE_INPUTS', () => {
      this.$v.inputText.$touch()
    })
  },
  computed: {
    inputClass () {
      return {
        'is-invalid': this.$v.$anyError,
        'form-control': true,
        ...this.placeholderClass
      }
    }
  },
  methods: {
    translateOption (option) {
      const lang = this.lang || this.defaultLang
      const defaultLang = this.defaultLang
      if (option.translation[lang]) {
        return option.translation[lang].label
      }
      if (option.translation[defaultLang]) {
        return option.translation[defaultLang].label
      }
      return option.label
    },
    triggerInput (val) {
      this.$v.inputText.$touch()
      this.$emit('input', this.inputText)
    }
  }
}
</script>
