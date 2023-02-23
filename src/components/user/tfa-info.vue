<template lang="pug">
  .tfa-info-panel
    panel-container.tfa-info-panel__panel(
      :title="$t('v2.user.tfaSettings')"
    )
      v-form(slot-scope="{readonly}")
        v-layout(row wrap)
          v-flex(xs12)
            v-select.mode(
              :items="tfaModeOptions"
              :label="$t('v2.user.authMode')"
              :readonly="readonly"
              item-text="display_name"
              placeholder="--"
              v-model="formData.tfa_mode"
            )
          v-flex(
            xs12
            v-if="pendingTfaVerification && !isValueChanged"
          )
            .tfa-verification-warning
              v-icon.tfa-verification-warning__icon warning
              span.tfa-verification-warning__text {{ $t('v2.user.verifyTfaWarningText') }}
            .tfa-verification-trigger(
              @click="onTfaVerificationClick"
            )
              | {{ $t('v2.user.clickToVerifyTfa') }}

        v-layout(row wrap)
          v-flex(xs12 text-xs-right)
            v-btn(
              v-show="isValueChanged"
              :loading="isLoading"
              @click="submit()"
              color="success"
              round
            ) {{ $t('general.save') }}

    tfa-verification-modal(
      :show="showTfaVerificationModal"
      @close="closeTfaVerificationModal"
    )

</template>

<script>
import { mapGetters } from 'vuex'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import PanelContainer from '@/components/common/panel-container'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import TfaVerificationModal from './tfa-verification-modal'

export default {
  name: 'TfaInfo',
  components: {
    PanelContainer,
    TfaVerificationModal
  },
  mixins: [
    CurrentUserMixin,
    ErrorHandlerMixin
  ],
  mounted () {
    this.setFormData()
  },
  data () {
    return {
      isLoading: false,
      formData: {
        tfa_mode: null
      },
      originalTfaMode: null,
      tfaModeOptions: [
        {
          display_name: this.$t('v2.user.sms'),
          value: 'sms'
        },
        {
          display_name: this.$t('v2.user.googleAuthenticator'),
          value: 'google_authenticator'
        },
        {
          display_name: this.$t('general.disabled'),
          value: 'disabled'
        }
      ],
      showTfaVerificationModal: false
    }
  },
  computed: {
    ...mapGetters('user', ['userOptions', 'currentUser']),
    pendingTfaVerification () {
      return this.currentUser && this.currentUser.tfa_settings &&
        this.currentUser.tfa_settings.tfa_mode !== this.currentUser.tfa_settings.verified_tfa_mode
    },
    isValueChanged () {
      return this.formData.tfa_mode !== this.originalTfaMode
    }
  },
  methods: {
    setFormData () {
      const tfaSettings = this.currentUser.tfa_settings
      this.formData = Object.assign({}, this.formData, {
        tfa_mode: tfaSettings ? tfaSettings.tfa_mode : null
      })

      this.originalTfaMode = this.formData.tfa_mode
    },
    onTfaVerificationClick () {
      this.showTfaVerificationModal = true
    },
    closeTfaVerificationModal () {
      this.showTfaVerificationModal = false
    },
    submit () {
      this.isLoading = true

      this.updateCurrentUser({ tfa_settings: this.formData }).then(response => {
        this.isLoading = false
        global.toastr['success'](this.$t('general.dataSaveSuccess'), this.$t('general.success'))

        // Set original tfa mode to new value after successful save
        this.originalTfaMode = this.formData.tfa_mode

        // Automatically open verification modal if verification required
        if (this.pendingTfaVerification) {
          this.onTfaVerificationClick()
        }
      }).catch(err => {
        this.isLoading = false
        this.setErrorData(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .tfa-verification-warning {
    overflow: hidden;

    &__icon {
      vertical-align: middle;
      float: left;
    }

    &__text {
      vertical-align: middle;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 24px;
      float: left;
      width: 80%;
      margin-left: 20px;
    }
  }

  .tfa-verification-trigger {
    margin-left: 45px;
    cursor: pointer;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 20px;
    color: $green-medium;
    text-decoration-line: underline;
  }
</style>
