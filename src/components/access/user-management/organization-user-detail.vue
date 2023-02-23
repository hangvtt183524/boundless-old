<template lang="pug">
  .organization-user-detail-page.page-content
    .organization-user-detail-page__header
      .organization-user-detail-page__header__back-link-container
        v-icon.organization-user-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.organization-user-detail-page__header__page-title
        | {{ $t('v2.access.modifyOrganizationAccess') }}
        span(
          v-if="organizationUser.email"
        ) / {{ organizationUser.name }} ({{organizationUser.email}})

      .organization-user-detail-page__header__actions
        base-button.base-button--green.organization-user-detail-page__header__actions__action(
          @click="onUpdateAccessClick"
          :disabled="!(isValid && isValueChanged)"
        )
          | {{ $t('v2.access.updateUserAccess') }}

    .organization-user-detail-page__content
      .organization-user-detail-page__content__description(
        v-if="organizationUser.id"
        v-html="$t('v2.access.changeOrganizationLevelAccessForOrganization').replace('{organization_name}', organizationUser.organization_name)"
      )

      .organization-user-detail-page__content__form
        user-organization-permissions-form(
          v-if="organizationUser.id"
          v-model="organizationUser"
          :owner-organization-id="ownerOrganizationId"
          @validStateChange="isValid = $event"
        )

    .organization-user-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    user-organization-update-confirm-modal(
      ref="confirmModal"
      :organizationUser="organizationUser"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import UserOrganizationUpdateConfirmModal from './user-organization-update-confirm-modal'
import UserOrganizationPermissionsForm from './user-organization-permissions-form'

export default {
  name: 'invitation',
  components: {
    UserOrganizationPermissionsForm,
    UserOrganizationUpdateConfirmModal,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    ownerOrganizationId: {
      type: Number,
      required: true
    },
    merakiOrganizationUserId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      isValid: null,
      organizationUser: {},
      originalOrganizationUser: {}
    }
  },
  mounted () {
    // Fetch user organizations
    this.fetchUser()
  },
  computed: {
    isValueChanged () {
      return !_.isEqual(this.organizationUser, this.originalOrganizationUser)
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchMerakiOrganizationUser', 'updateMerakiOrganizationUser']),
    fetchUser () {
      this.fetchMerakiOrganizationUser({
        workspaceId: this.workspaceId,
        id: this.merakiOrganizationUserId
      }).then(response => {
        this.organizationUser = response.data.data
        this.originalOrganizationUser = _.cloneDeep(response.data.data)
      })
    },
    onUpdateAccessClick () {
      this.$refs.confirmModal.open().then(confirm => {
        if (confirm) {
          this.loading = true
          this.updateMerakiOrganizationUser({
            workspaceId: this.workspaceId,
            id: this.merakiUserId,
            ...this.organizationUser
          }).then(() => {
            global.toastr['success'](this.$t('v2.access.successfullyUpdatedUserAccess'), this.$t('general.success'))

            // Re-fetch user
            this.fetchUser()
          }).catch(err => {
            // Display Meraki errors if any
            const error = err.response.data.error
            if (error.messages.find(errorMessage => errorMessage.code === 'meraki_api_error')) {
              error.messages.forEach(errorMessage => {
                if (errorMessage.code === 'meraki_api_error') {
                  global.toastr['error'](errorMessage.message, this.$t('general.error'))
                }
              })
            } else {
              global.toastr['error'](this.$t('v2.access.failedToUpdateUserAccess'), this.$t('general.error'))
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";
@import "styles/v2/base.scss";

.organization-user-detail-page {
  background-color: $white;
  position: relative;

  &__header {
    height: 60px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding: 0 30px 0 0;
    overflow: hidden;

    &__back-link-container {
      float: left;
      width: 60px;
      line-height: 60px;
      border-right: 1px solid $gray-xlight;
      text-align: center;

      &__back-icon {
        color: $blue-reserve;
        line-height: 60px;
      }
    }

    &__page-title {
      margin-left: 33px;
      line-height: 60px;
      letter-spacing: 1px;
      float: left;
    }

    &__actions {
      float: right;

      &__action {
        margin: 10px 0 0 13px;
        width: 180px;
      }
    }
  }

  &__content {
    box-sizing: border-box;
    padding: 24px 30px;

    &__description {
      line-height: 24px;
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: $text-medium;
      margin-bottom: 40px;
      margin-top: 20px;
    }

    &__form {
      margin-top: 20px;
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

@media (min-width: 1264px) {
  .organization-user-detail-page {
    &__content {
      height: calc(100vh - 180px);
    }
  }
}
</style>
