<template lang="pug">
  base-text-input-option(
    :selected-item="selectedItem"
    :settings-config="settingsConfig"
    :lang="lang"
    :default-lang="defaultLang"
  )
</template>

<script>
import baseTextInputOption from './text-input-option'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang'],

  components: {
    baseTextInputOption
  }
}
</script>
