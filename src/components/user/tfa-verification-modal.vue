<template lang="pug">
  base-modal(
    class="tfa-verification-modal"
    :show="show"
    @close="close"
    max-width="540px"
  )
    template(v-slot:header)
      div.tfa-verification-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.tfa-verification-modal__title
              | {{ $t('v2.user.tfaVerificationModalTitle') }}

    template(v-slot:default)
      div.tfa-verification-modal__content
        v-layout(
          row wrap
        )
          v-flex(xs12)
            .tfa-verification-modal__content__description(
              v-if="targetTfaMode === 'google_authenticator'"
            )
              | {{ $t('v2.user.tfaVerificationModalGoogleDescription') }}

            .tfa-verification-modal__content__description(
              v-if="targetTfaMode === 'sms'"
            )
              | {{ $t('v2.user.tfaVerificationModalSMSDescription') }}

            .tfa-verification-modal__content__description(
              v-if="targetTfaMode === 'disabled' && verifiedTfaMode === 'google_authenticator'"
            )
              | {{ $t('v2.user.tfaVerificationModalDisableGoogleDescription') }}

            .tfa-verification-modal__content__description(
              v-if="targetTfaMode === 'disabled' && verifiedTfaMode === 'sms'"
            )
              | {{ $t('v2.user.tfaVerificationModalDisableSMSDescription') }}

          v-flex.tfa-verification-modal__content__qr-code-container(
            xs12 mt-3
            v-if="targetTfaMode === 'google_authenticator' || (targetTfaMode === 'disabled' && verifiedTfaMode === 'google_authenticator')"
          )
            qrcode-vue(
              v-if="tfaSecretData.provisioning_uri"
              :value="tfaSecretData.provisioning_uri"
              :size="200"
            )

          v-flex(xs12 mt-3)
            .tfa-verification-modal__content__secret-text(
              v-if="tfaSecretData.tfa_secret && (targetTfaMode === 'google_authenticator' || (targetTfaMode === 'disabled' && verifiedTfaMode === 'google_authenticator'))"
            )
              | {{ tfaSecretData.tfa_secret }}

        v-layout(row wrap)
          v-flex(xs6 mt-3)
            base-text-input(
              v-model="code"
              :validations="{ required: true }"
              :placeholder="$t('login.code')"
            )

    template(v-slot:footer)
      div.tfa-verification-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              :disabled="!code"
              class="base-button--green"
              @click="onSubmitClick"
              :loading="saving"
            ) {{ $t('general.submit') }}

            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

    div.tfa-verification-modal__loading-indicator(v-if="loading")
      v-progress-circular(
        :size="50"
        indeterminate color="#15ac2f")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import QrcodeVue from 'qrcode.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  components: {
    BaseTextInput,
    BaseModal,
    BaseButton,
    QrcodeVue
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      saving: false,
      tfaSecretData: {},
      code: null,
      token: null
    }
  },

  computed: {
    ...mapGetters('user', ['currentUser']),
    targetTfaMode () {
      return this.currentUser.tfa_settings ? this.currentUser.tfa_settings.tfa_mode : null
    },
    verifiedTfaMode () {
      return this.currentUser.tfa_settings ? this.currentUser.tfa_settings.verified_tfa_mode : 'disabled'
    }
  },

  watch: {
    show: {
      handler (val) {
        if (val) {
          // Reset form data
          this.code = null
          this.token = null

          this.fetchUserTfaSecretData()
          this.createUserTfaSettingsVerificationCode()
        }
      }
    }
  },

  methods: {
    ...mapActions('user', ['fetchUserTfaSecret', 'generateUserTfaVerificationCode', 'verifyUserTfaSettings']),
    fetchUserTfaSecretData () {
      this.loading = true
      this.fetchUserTfaSecret(this.currentUser.id).then(response => {
        this.$set(this, 'tfaSecretData', response.data.data)
      }).finally(() => {
        this.loading = false
      })
    },
    createUserTfaSettingsVerificationCode () {
      this.loading = true
      this.generateUserTfaVerificationCode(this.currentUser.id).then(response => {
        this.$set(this, 'token', response.data.data.token)
      }).finally(() => {
        this.loading = false
      })
    },
    onSubmitClick () {
      this.loading = true
      this.saving = true
      this.verifyUserTfaSettings({
        userId: this.currentUser.id,
        token: this.token,
        code: this.code
      }).then(response => {
        global.toastr['success'](this.$t('v2.user.tfaVerificationSuccess'), this.$t('general.success'))
        this.close()
      }).finally(() => {
        this.loading = false
        this.saving = false
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/v2/colors";

  .tfa-verification-modal {
    position: relative;

    &__header {

    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__content {
      margin-top: 16px;

      &__qr-code-container {
        text-align: center;
      }

      &__secret-text {
        font-weight: bold;
        text-align: center;
      }
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }

</style>
