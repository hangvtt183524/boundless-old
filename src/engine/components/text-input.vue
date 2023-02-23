<template lang="pug">
  .form-group.page-component.text-input(
    :style="textInputContainerStyle"
  )
    label(v-show="config.showLabel", :style="textInputLabelStyle") {{translated.label}}
    input(
      :type="type"
      class="form-control"
      autocomplete="disabled"
      :name="config.fieldName"
      :placeholder="translated.placeholder"
      v-model="inputText"
      :style="textInputStyle"
      @input="triggerInput"
      @blur="triggerValidation"
      :class="inputClass"
    )
    .invalid-feedback(v-if="config.fieldRequired && !$v.inputText.required") Field is Required
    .invalid-feedback(v-if="type === 'email' && !$v.inputText.email") Must be a valid email address
</template>

<script>
import { required, email, helpers } from 'vuelidate/lib/validators'
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/text-input'
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
    pageConfig: {
      type: Object,
      required: true
    },
    title: {
      default: 'Text Input',
      type: String
    },
    type: {
      default: 'text',
      type: String
    }
  },
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ],
  data () {
    return {
      touched: false,
      inputText: ''
    }
  },
  computed: {
    inputClass () {
      return {
        'is-invalid': this.touched && this.$v.$anyError,
        [this.wrapClass]: true,
        ...this.placeholderClass
      }
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

    if (this.type === 'email') {
      obj.inputText.email = email
    }

    return obj
  },
  mounted () {
    this.$eventHub.$on('VALIDATE_INPUTS', () => {
      this.$v.inputText.$touch()
      this.touched = true
    })
  },
  methods: {
    triggerInput (val) {
      this.$v.inputText.$touch()
      this.$emit('input', this.inputText)
    },
    triggerValidation () {
      this.touched = true
      this.$emit('valid', {
        index: this.index,
        valid: !this.$v.inputText.$anyError
      })
    }
  }
}
</script>
