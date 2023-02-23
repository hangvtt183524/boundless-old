<template lang='pug'>
  div
    login
    reset-password-dialog(:show="showResetPasswordDialog", @close="showResetPasswordDialog = false")
</template>

<script>
import Login from './login'
import ResetPasswordDialog from './reset-password-dialog'

export default {
  name: 'ResetPassword',

  // use auth from auth.service
  props: ['auth'],

  components: {
    Login,
    ResetPasswordDialog
  },

  data () {
    // each field is represented by a value property and its validation rule
    return {
      showResetPasswordDialog: true
    }
  }
}
</script>
