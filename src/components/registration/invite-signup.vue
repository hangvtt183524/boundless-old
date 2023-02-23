<template lang="pug">
  v-app
    v-content
      v-container.invite-signup(fluid fill-height)
        v-layout(class="align-center justify-center")
          v-flex(xs12 sm7 md3)
            v-card.pa-4
              v-card-text
                .logo-container
                  img.logo-image(src="@/assets/images/boundless-logo.png")
                  p.tag-line {{ $t('login.welcomeTo') }}
                  h3.logo-text  BOUNDLESS

                registration-form.mt-5(
                  :submit-text="$t('login.completeSignupText')"
                  :identity-providers="identityProviders"
                  v-if="invitationValid"
                )
                p.alert(v-if="invitationValid === false") {{ $t('login.invitationKeyInvalidMessage') }}
</template>

<script>
import { mapActions } from 'vuex'
import RegistrationForm from './registration-form'

export default {
  name: 'Register',
  components: {
    RegistrationForm
  },
  props: {
    organizationSlug: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      invitationValid: null,
      identityProviders: []
    }
  },
  mounted () {
    // Check validity of invitation key and email, if valid, show registration form. Otherwise display a related error
    // message
    this.formData = Object.assign({}, this.formData, this.$route.query)
    if (this.formData.invitation_key) {
      this.checkInvitation({
        invitation_key: this.formData.invitation_key,
        email: this.formData.email
      }).then(response => {
        if (response.data.data.is_valid) {
          this.invitationValid = true
        } else {
          this.invitationValid = false
        }
      })
    }

    // If we are on an organization specific invitation page, fetch organization identity providers
    if (this.organizationSlug) {
      this.getOrganizationIdentityProviders()
    }
  },

  methods: {
    ...mapActions('user', ['checkInvitation']),
    ...mapActions('auth', ['fetchNodeIdentityProviders']),

    getOrganizationIdentityProviders () {
      this.loading = true
      this.fetchNodeIdentityProviders(this.organizationSlug).then(response => {
        this.$set(this, 'identityProviders', response.data.data)
      }).catch((err) => {
        this.setErrorData(err)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import 'styles/_logo-container.scss';
.invite-signup {
  flex: 1;
  background: url('../../assets/images/background.png') no-repeat center center;
  background-size: cover;

  .tag-line {
    margin-top: 20px;
  }
  .alert {
    margin-top: 20px;
    color: red;
    text-align: center;
    font-size: 18px;
  }
}

html {
  overflow-y: auto !important;
}
</style>
