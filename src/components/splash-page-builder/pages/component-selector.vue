<template lang="pug">
  .mt-2.text-center.add-block(v-if="show")
    select.form-control(v-model="mutatedValue" @change="changeComponentSelection")
      option(value="text-input") {{ $t('builder.textInput') }}
      option(value="email-input") {{ $t('builder.emailInput') }}
      option(value="phone-input") {{ $t('builder.phoneInput') }}
      option(value="select-input") {{ $t('builder.selectInput') }}
      option(value="heading") {{ $t('builder.heading') }}
      option(value="base-link") {{ $t('builder.link') }}
      option(value="text-paragraph") {{ $t('builder.text') }}
      option(value="facebook-button") {{ $t('builder.facebookButton') }}
      option(value="instagram-button") {{ $t('builder.instagramButton') }}
      option(value="google-button") {{ $t('builder.googleButton') }}
      option(value="twitter-button") {{ $t('builder.twitterButton') }}
      option(value="linkedin-button") {{ $t('builder.linkedInButton') }}
    button.btn.btn-secondary.ml-2(@click="addInput") {{ $t('builder.add') }}
  .mt-2.text-center.add-block(v-else)
    button.btn.btn-secondary(@click="emitToggle") {{ $t('builder.addInput') }}
</template>

<script>
export default {
  props: ['show', 'value'],
  data () {
    return {
      mutatedValue: ''
    }
  },
  mounted () {
    this.mutatedValue = this.value
  },
  methods: {
    changeComponentSelection (e) {
      this.mutatedValue = e.target.value
      this.$emit('input', this.mutatedValue)
    },
    emitToggle () {
      this.$emit('toggle')
    },
    addInput () {
      this.$emit('add')
    }
  },
  watch: {
    mutatedValue (value) {
      this.$emit('input', value)
    }
  }
}
</script>
