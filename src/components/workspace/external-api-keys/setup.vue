<template lang="pug">
  .api-key-setup
    .api-key-setup__content-area
      .api-key-setup__header
        .api-key-setup__header__title
          | {{ $t('v2.workspaces.externalApiKeys.enterYourApiKey') }}
      .api-key-setup__content
        .api-key-setup__content__description
          | {{ $t('v2.workspaces.externalApiKeys.apiKeySetupDescription') }}

        .api-key-setup__content__form
          v-layout(row wrap)
            v-flex(xs12)
                base-text-input(
                  v-model="apiKey"
                  :label="$t('v2.workspaces.externalApiKeys.merakiApiKey')"
                  :placeholder="$t('v2.workspaces.externalApiKeys.copyApiKeyHere')"
                  :validations="{required: true}"
                )
                  v-icon.api-key-setup__content__form__valid-icon(
                    v-show="apiKeyValid === true"
                  ) check

          v-layout(row wrap)
            v-flex(xs12)
              span.api-key-setup__content__form__error(
                v-if="apiKeyValid === false"
              ) * {{ $t('v2.workspaces.externalApiKeys.merakiApiKeyInvalid')}}

        .api-key-setup__content__api-key-help
          v-layout(row wrap)
            v-flex(xs12)
              .api-key-setup__content__api-key-help__trigger(
                @click="onHelpTriggerClick"
              )
                span.api-key-setup__content__api-key-help__trigger__text {{ $t('v2.workspaces.externalApiKeys.apiKeySetupHelpTrigger') }}
                v-icon.api-key-setup__content__api-key-help__trigger____icon(
                  v-if="!helpSectionVisible"
                ) arrow_drop_down
                v-icon.api-key-setup__content__api-key-help__trigger____icon(
                  v-if="helpSectionVisible"
                ) arrow_drop_up
              transition(name="slide")
                .api-key-setup__content__api-key-help__body(
                  v-show="helpSectionVisible"
                )
                  api-key-setup-help

      .api-key-setup__footer
        .api-key-setup__footer__actions
          .api-key-setup__footer__actions__left-actions
            base-button.base-button--green--negative.api-key-setup__footer__actions__action(
              v-show="!backButtonHidden"
              @click="onBackClick"
            ) {{ $t('general.back') }}

          .api-key-setup__footer__actions__right-actions
            base-button.base-button--green.api-key-setup__footer__actions__action(
              :disabled="apiKeyValid !== true"
              @click="onNextClick"
            ) {{ $t('general.next') }}

    .api-key-setup__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    job-tracking-modal(
      :persistent="true"
      ref="jobTrackingModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import ApiKeySetupHelp from './setup-help.vue'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'

export default {
  name: 'api-key-setup',
  components: {
    BaseCheckBox,
    BaseTabHeader,
    BaseTextInput,
    BaseSelect,
    BaseButton,
    ApiKeySetupHelp,
    JobTrackingModal
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    CurrentUserMixin
  ],
  props: {
    nextPage: {
      type: String,
      default: 'ExternalApiKeys'
    },
    backButtonHidden: {
      type: Boolean,
      default: false
    },
    waitImportCompletion: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      apiKey: '',
      apiKeyValid: null,
      helpSectionVisible: false,
      loading: false
    }
  },
  watch: {
    apiKey: {
      handler: _.debounce(function () {
        this.checkApiKeyValidity()
      }, 400)
    }
  },
  methods: {
    ...mapActions('organization', ['fetchOrganization']),
    ...mapActions('workspace', ['createWorkspaceExternalApiKey']),
    checkApiKeyValidity () {
      let data = {
        organizationId: this.organizationId,
        api_key: this.apiKey
      }

      this.apiKeyValid = null
      this.loading = true
      this.$store.dispatch('organization/meraki/fetchApiKeyOrganizations', data).then(response => {
        this.apiKeyValid = response.data.data.length > 0
      }).catch(() => {
        this.apiKeyValid = false
      }).finally(() => {
        this.loading = false
      })
    },
    onHelpTriggerClick () {
      this.helpSectionVisible = !this.helpSectionVisible
    },
    onBackClick () {
      this.$router.go(-1)
    },
    onNextClick () {
      this.loading = true
      this.createWorkspaceExternalApiKey({
        api_key: this.apiKey,
        name: this.$t('v2.workspaces.externalApiKeys.usersKey').replace('{user_name}', this.currentUser.profile.full_name),
        vendor: 'meraki',
        workspaceId: this.workspaceId
      }).then(response => {
        if (this.waitImportCompletion) {
          // Wait for the api key import job to complete, then continue
          this.$refs.jobTrackingModal.open(
            response.data.data.id,
            this.$t('v2.workspaces.externalApiKeys.syncProgressTitle'),
            this.$t('v2.workspaces.externalApiKeys.syncProgressDescription')
          ).then(success => {
            if (success) {
              global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.syncSuccess'), this.$t('general.success'))
              this.onImportFinish()
            }
          })
        } else {
          // Directly trigger import finish handler
          this.onImportFinish()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onImportFinish () {
      global.toastr['success'](this.$t('v2.workspaces.externalApiKeys.addApiKeySuccess'), this.$t('general.success'))

      // Go to next page
      this.$router.push({ name: this.nextPage })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.api-key-setup {
  background-color: $white;
  position: relative;
  text-align: center;

  &__content-area {
    max-width: 960px;
    margin: 0 auto;
  }

  &__header {
    padding: 60px 30px;

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      color: $blue-dark;
      text-align: center;
    }
  }

  &__content {
    &__description {
      line-height: 24px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      color: $text-medium;
      margin-bottom: 40px;
      text-align: center;
    }

    &__form {
      margin: 40px auto;
      width: 480px;
      text-align: left;

      &__error {
        display: inline-block;
        margin-top: 20px;
        font-family: Fira Sans;
        font-style: italic;
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: $blue-reserve;
      }

      &__valid-icon {
        color: $green-medium;
      }

      .base-text-input ::v-deep {
        input {
          padding-right: 40px;
        }
      }
    }

    &__api-key-help {
      margin-top: 40px;

      &__trigger {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 59px;
        color: $blue-reserve;
        cursor: pointer;
        user-select: none;

        &__text {
          vertical-align: middle;
        }

        &__icon {
          line-height: 59px;
          color: $blue-reserve;
          float: right;
        }
      }

      &__body {
        border-top: 1px solid $gray-light;
        border-bottom: 1px solid $gray-light;
      }
    }
  }

  &__footer {
    padding: 30px 40px;

    &__actions {
      overflow: hidden;

      &__left-actions {
        float: left;
      }

      &__right-actions {
        float: right;
      }
    }

    .base-button {
      padding: 0 20px;
    }
  }

  .slide-enter-active {
    transition-duration: 0.2s;
    transition-timing-function: linear;
  }

  .slide-leave-active {
    transition-duration: 0.2s;
    transition-timing-function: linear;
  }

  .slide-enter-to, .slide-leave {
    max-height: 100px;
    overflow: hidden;
  }

  .slide-enter, .slide-leave-to {
    overflow: hidden;
    max-height: 0;
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
