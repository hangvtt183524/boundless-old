<template lang='pug'>
    div
        | Click #[a(:href='dashboardUrl' target='_blank') here] to be redirected to the presence analytics dashboard
</template>

<script>
export default {
  name: 'PresenceAnalytics',

  data () {
    return {
      dashboardUrl: 'http://dashboard.ivizone.com/users/'
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (process.env.NODE_ENV === 'production') {
        window.open(vm.dashboardUrl, '_blank')
      }
    })
  }
}
</script>
