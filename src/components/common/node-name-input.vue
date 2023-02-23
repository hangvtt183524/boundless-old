<template lang="pug">
  v-text-field(
    :rules="rules"
    :counter="showMaxLength ? maxLength : false"
    :value="value"
    @input="$emit('input', $event)"
    @focus="showMaxLength = true"
    @blur="() => { showMaxLength = false; $emit('blur') }"
    v-bind="$attrs"
  )
</template>
<script>
import { VTextField } from 'vuetify'

export default {
  extends: VTextField,
  props: {
    value: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 64
    }
  },
  data () {
    return {
      showMaxLength: false
    }
  },
  computed: {
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || this.$t('general.maxCharacters', { count: this.maxLength })
      }
      return [maxRule]
    }
  }
}
</script>
