<template lang="pug">
  .sub-panel
    .setting-type
      label {{$t('builder.general')}}
    v-layout
      v-flex(xs12)
        node-name-input(
          :error-messages="validateErrors('name')"
          :label="$t('builder.name')"
          required
          :maxLength="50"
          @input="$v.name.$touch()"
          @blur="onBlur"
          v-model="name"
        )
</template>

<script>
import { maxLength, required } from 'vuelidate/lib/validators'
export default {
  props: ['page'],
  data () {
    return {
      name: ''
    }
  },
  validations: {
    name: {
      required,
      maxLength: maxLength(50)
    }
  },
  mounted () {
    this.name = this.page.name
  },
  methods: {
    onBlur () {
      this.$v.name.$touch()
      if (!this.$v.name.$invalid) {
        if (this.page.name !== this.name) {
          this.page.name = this.name
        }
      } else {
        this.name = this.page.name
      }
    },
    validateErrors (fieldName) {
      const errors = []
      const name = this.$v[fieldName]
      if (!name.$dirty) return errors
      !name.required && errors.push(this.$t('errors.required'))
      return errors
    }
  }
}
</script>
