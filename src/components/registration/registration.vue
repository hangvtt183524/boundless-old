<template lang='pug'>
  div(data-test="signup-page")
    p.login-text {{ $t('login.signUpText')}}
    // the links below the form: register and forgot pass

    registration-form

    v-layout(row).mt-3
      v-flex.text-xs-center(xs12)
        router-link.login-layout-link(to="/login") {{ $t("login.alreadyRegistered") }}
</template>

<script>
import RegistrationForm from './registration-form'

export default {
  name: 'Register',
  components: {
    RegistrationForm
  }
}
</script>
