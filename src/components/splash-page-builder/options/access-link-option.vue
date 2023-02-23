<template lang="pug">
  base-link-option(
    :selected-item="selectedItem"
    :settings-config="settingsConfig"
    :lang="lang"
    :defaultLang="defaultLang"
  )
</template>

<script>
import baseLinkOption from './link-option'

export default {
  props: ['selectedItem', 'settingsConfig', 'lang', 'defaultLang'],

  components: {
    baseLinkOption
  }
}
</script>
