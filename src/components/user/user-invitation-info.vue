<template lang="pug">
  .user-invitation-info
    .user-invitation-info__content
      .user-invitation-info__content__field(
        v-if="invitationDetails !== null"
      )
        .user-invitation-info__content__field__label
          | {{ $t('v2.user.invitation') }}:
        .user-invitation-info__content__field__value
          span {{ invitationDetails.is_accepted === true ? $t('general.accepted') : $t('general.pending') }}
          .pending-indicator(v-if="!invitationDetails.is_accepted")
        .user-invitation-info__content__field__actions(
          v-if="invitationDetails.is_accepted === false"
        )
          .user-invitation-info__content__field__action(
            @click="onResendInvitationClick"
          )
            | {{ $t('v2.user.resend') }}
          .user-invitation-info__content__field__action(
           @click="onRevokeInvitationClick"
          )
            | {{ $t('v2.user.revoke') }}

      .user-invitation-info__content__field(
        v-if="invitationDetails !== null"
      )
        .user-invitation-info__content__field__label
          | {{ $t('v2.user.invitedBy') }}:
        .user-invitation-info__content__field__value
          | {{ invitationDetails.created_by }}

      .user-invitation-info__content__field(
        v-if="mode === modes.internal"
      )
        .user-invitation-info__content__field__label
          | {{ $t('general.password') }}:
        .user-invitation-info__content__field__value(
          v-if="passwordUpdateData.isEditing"
        )
          base-text-input.base-text-input--small(
            :value="passwordUpdateData.value"
            @input="$emit('passwordInput', $event)"
            :validations="{ required: true }"
          )
            v-icon(
              @click="reGeneratePassword"
            ) {{'$vuetify.icons.update'}}
          .user-invitation-info__content__field__value__errors
            .user-invitation-info__content__field__value__errors__item(
              v-for="pwdErr in passwordUpdateData.updateErrors"
              :key="pwdErr.message"
            ) {{ pwdErr.message }}
        .user-invitation-info__content__field__value(
          v-if="!passwordUpdateData.isEditing"
        )
          span {{ '**********' }}
          v-icon(
            @click="$emit('passwordEditStateChange')"
          ) {{'$vuetify.icons.edit'}}

      .user-invitation-info__content__field(
        v-if="mode === modes.internal"
      )
        .user-invitation-info__content__field__label
          | {{ $t('v2.user.twoFactorAuthentication') }}:
        .user-invitation-info__content__field__value
          | {{ is2faEnabled ? $t('general.enabled') : $t('general.disabled') }}
        .user-invitation-info__content__field__actions(
          v-if="is2faEnabled"
        )
          .user-invitation-info__content__field__action(
            @click="$emit('disableTfaClick')"
          )
            | {{ $t('general.disable') }}

      .user-invitation-info__content__field
        .user-invitation-info__content__field__label
          | {{ $t('v2.user.lastConnected') }}:
        .user-invitation-info__content__field__value
          | {{ lastConnected || $t('general.never') }}

    confirm-modal(
      ref="confirmModal"
    )
</template>

<script>
import PasswordGenerator from 'strict-password-generator'
import { mapActions } from 'vuex'
import { dateTimeFormatter } from '@/utils/global-cell-formatters'
import ConfirmModal from '@/components/v2/confirm-modal/confirm-modal'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  name: 'user-invitation-info',
  components: {
    ConfirmModal,
    BaseTextInput
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'workspace'
    },
    passwordUpdateData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      }
    }
  },
  computed: {
    invitationDetails () {
      if (!this.user.invitation_details ||
        (Array.isArray(this.user.invitation_details) && this.user.invitation_details.length === 0)) {
        return null
      }

      if (Array.isArray(this.user.invitation_details)) {
        return this.user.invitation_details[0]
      } else {
        return this.user.invitation_details
      }
    },
    lastConnected () {
      return dateTimeFormatter(this.user.last_login)
    },
    is2faEnabled () {
      return this.user.tfa_settings && this.user.tfa_settings.verified_tfa_mode !== 'disabled'
    }
  },
  methods: {
    ...mapActions('user', ['resendInvitation', 'cancelInvitation']),
    onResendInvitationClick () {
      this.$emit('loadingStateChange', true)
      this.resendInvitation(this.invitationDetails.id).then((response) => {
        global.toastr['success'](this.$t('v2.user.resendInvitationSuccessful'), this.$t('general.success'))
      }).finally(() => {
        this.$emit('loadingStateChange', false)
      })
    },
    reGeneratePassword () {
      const passwordGenerator = new PasswordGenerator()
      const options = {
        upperCaseAlpha: false,
        lowerCaseAlpha: true,
        number: true,
        specialCharacter: true,
        minimumLength: 12,
        maximumLength: 12
      }
      this.$emit('passwordInput', passwordGenerator.generatePassword(options))
    },
    onRevokeInvitationClick () {
      this.$refs.confirmModal.open(
        this.$t('errors.warning'),
        this.$t('v2.user.revokeInvitationConfirmation').replace('{username}', '<b>' + this.user.profile.full_name + '</b>')
      ).then(confirm => {
        if (confirm) {
          this.$emit('loadingStateChange', true)
          this.cancelInvitation(this.invitationDetails.id).then((response) => {
            global.toastr['success'](this.$t('v2.user.revokeInvitationSuccess'), this.$t('general.success'))
            this.$set(this.user, 'invitation_details', null)
            this.$emit('invitationRemoval')
          }).finally(() => {
            this.$emit('loadingStateChange', false)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .user-invitation-info {
    border-top: 4px solid rgba($gray-xlight, .5);
    padding-top: 20px;
    margin-top: 20px;

    &__header {
      height: 38px;
      line-height: 38px;
      padding: 0 14px;
      background-color: $gray-xlight;
      overflow: hidden;

      &__title {
        float: left;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: $text-dark;
      }

      &__actions {
        float: right;
      }

      &__action {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;

        text-align: right;
        text-decoration-line: underline;
        color: $blue-reserve;
        cursor: pointer;
      }
    }

    &__content {
      padding: 0 14px;

      &__field {
        line-height: 36px;
        font-family: Fira Sans;
        font-style: normal;
        font-size: 15px;
        color: $text-medium;
        overflow: hidden;

        &__label {
          font-weight: 600;
          margin-right: 5px;
          display: inline;
        }

        &__value {
          display: inline;

          &__errors {
            margin-left: 75px;

            &__item {
              font-family: Fira Sans;
              font-style: italic;
              font-weight: normal;
              font-size: 14px;
              line-height: 22px;
              color: $blue-reserve;
            }
          }

          .v-icon {
            font-size: 15px;
            width: 30px;
            height: 30px;
            float: right;
          }

          .base-text-input--small ::v-deep{
            display: inline-block;
            width: calc(100% - 85px);
            margin-left: 10px;
            vertical-align: middle;

            input {
              padding: 7px 30px 7px 13px;
              line-height: 16px;
            }

            .v-icon {
              border-left: 1px solid $gray-light;
              right: 0;
              opacity: 1;
            }
          }
          .pending-indicator {
            margin-left: 4px;
            margin-bottom: 7px;
            width: 4px;
            height: 4px;
            border-radius: 4px;
            background: #f2c94c;
            display: inline-block;
          }
        }

        &__actions {
          float: right;
        }

        &__action {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;

          text-align: right;
          text-decoration-line: underline;
          color: $blue-reserve;
          cursor: pointer;
          display: inline;

          &:not(:first-child) {
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>
