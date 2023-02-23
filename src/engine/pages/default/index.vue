<template lang="pug">
  div
</template>

<script>

export default {
  props: {
    pageConfig: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.redirect()
  },
  updated () {
    this.redirect()
  },
  watch: {
    $route (to, from) {
      if (to && to.path === '/') {
        this.redirect()
      }
    }
  },
  methods: {
    redirect () {
      // try {
      if (!this.pageConfig.pages.defaultPage) {
        this.pageConfig.pages.defaultPage = 'guestForm'
      }
      switch (this.pageConfig.pages.defaultPage) {
        case 'guestSocial':
          this.$router.push('social')
          break
        case 'smsRegistration':
          this.$router.push('sms-reg')
          break
        case 'sponsorPage':
          this.$router.push('sponsor')
          break
        case 'ticketing':
          this.$router.push('ticketing')
          break
        case 'codes':
          this.$router.push('codes')
          break
        case 'sso':
          this.$router.push('sso')
          break
        case 'userLogin':
          this.$router.push('user-login')
          break
        case 'wifi4eu':
          this.$router.push('wifi4eu')
          break
        default:
          this.$router.push('guest-form')
      }
      // } catch (err) {
      //   console.error(err)
      // }
    }
  }
}
</script>
