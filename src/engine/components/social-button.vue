<template lang="pug">
  base-button.linkedin(
    :index="index",
    :config="config"
    :lang="lang"
    @click="onClick"
  )
</template>

<script>
import baseButton from './button'

export default {
  props: ['index', 'config', 'lang', 'pageParams', 'componentName'],
  components: {
    baseButton
  },
  methods: {
    onClick () {
      if (this.isInPreview()) {
        this.$eventHub.$emit('TOGGLE_PREVIEW_MODAL')
        return
      }

      const socialLoginType = this.componentName.split('-')[0]

      let url = this.pageParams.registration_server + `/portal/auth/${socialLoginType}/?` + this.getQuery()
      window.location = url
    },
    getQuery () {
      return Object.keys(this.pageParams).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(this.pageParams[k])}`).join('&')
    },
    isInPreview () {
      // return false
      return !this.pageParams.portal
    }
  }
}
</script>
