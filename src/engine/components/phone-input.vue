<template lang="pug">
  tel-input(
    v-model="inputText"
    :config="config"
    :lang="lang"
    :index="index"
    @valid="validateInput"
    @input="triggerInput"
  )
</template>

<script>
import telInput from './tel-input/input'
import './tel-input/tel-input.css'
// import 'vue-tel-input/dist/vue-tel-input.css'

export default {
  props: ['index', 'config', 'lang', 'pageConfig'],
  data () {
    return {
      inputText: ''
    }
  },
  components: {
    telInput
  },
  methods: {
    triggerInput (val) {
      this.$emit('input', val)
    },
    validateInput (val) {
      this.$emit('valid', val)
    }
  }
}
</script>
