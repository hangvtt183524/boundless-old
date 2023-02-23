<template lang="pug">
  .options-container
    component(
      :is="componentOptions"
      :selected-item="selectedItem"
      :settings-config="settingsConfig"
      :selected-page="selectedPage"
      :lang="lang"
      :default-lang="defaultLang"
    )
</template>

<script>
import heading from './heading-option'
import buttonOptions from './button-option'
import textInput from './text-input-option'
import emailInput from './email-input-option'
import passwordInput from './password-input-option'
import phoneInput from './phone-input-option'
import termsCheckbox from './terms-checkbox-option'
import logo from './logo-option'
import accessLink from './access-link-option'
import loader from './loader-option'
import selectInput from './select-input-option'
import baseLink from './link-option'
import textParagraph from './text-paragraph-option'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang', 'selectedPage'],
  components: {
    heading,
    buttonOptions,
    textInput,
    emailInput,
    passwordInput,
    phoneInput,
    termsCheckbox,
    logo,
    accessLink,
    loader,
    baseLink,
    selectInput,
    textParagraph
  },
  computed: {
    componentOptions () {
      let buttons = [
        'facebook-button',
        'instagram-button',
        'google-button',
        'linkedin-button',
        'twitter-button',
        'email-button',
        'submit-button'
      ]
      if (buttons.indexOf(this.selectedItem.component) !== -1) {
        return 'button-options'
      }
      return this.selectedItem.component
    }
  }
}
</script>
<style lang="scss">
  .page-builder {
    .options-container label{
      user-select: none;
    }
  }
</style>
