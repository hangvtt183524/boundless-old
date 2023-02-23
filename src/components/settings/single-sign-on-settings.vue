<template lang="pug">
  .external-integrations(
    data-test="settings-external-integrations-page"
  )
    single-sign-on-settings
</template>

<script>
import SingleSignOnSettings from './single-sign-on/single-sign-on-settings'

export default {
  components: {
    SingleSignOnSettings
  },
  props: {
    mode: {
      type: String,
      default: 'organization'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .external-integrations {
    width: 100%;
    background-color: $white;
  }
</style>
