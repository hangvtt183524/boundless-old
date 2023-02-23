<template lang='pug'>
  div
    activity-indicator(:show='true')
      #social-user-hidden-form-wrapper
</template>

<script>
import activityIndicator from '@/components/common/activity-indicator.vue'

// auth0 callback action
export default {
  name: 'Callback',

  components: { activityIndicator },

  props: ['auth'],

  data () {
    this.auth.handleSocialAuthentication()
    return {}
  }
}
</script>
