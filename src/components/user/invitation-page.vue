<template lang="pug">
  .invitation-page.page-content
    .invitation-page__header
      .invitation-page__header__back-link-container
        v-icon.invitation-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.invitation-page__header__page-title
        | {{ $t('v2.user.inviteUser') }}
      .invitation-page__header__actions
        base-button.base-button--green.invitation-page__header__actions__action(
          @click="onSendClick"
          :disabled="!isValid"
        )
          | {{ $t('v2.user.sendInvitation') }}
        base-button.base-button--green--negative.invitation-page__header__actions__action(
          @click="onCancelClick"
        )
          | {{ $t('general.cancel') }}

    .invitation-page__content
      v-layout(row wrap)
        v-flex(xs12 md6 lg4).invitation-page__content__form-section
          base-text-input.invitation-page__content__form-section__input(
            v-model="form.first_name"
            :label="$t('login.firstName')"
            placeholder="..."
            :validations="nameFieldValidations"
          )
          base-text-input.invitation-page__content__form-section__input(
            v-model="form.last_name"
            :label="$t('login.lastName')"
            placeholder="..."
            :validations="nameFieldValidations"
          )
          base-text-input.invitation-page__content__form-section__input(
            v-model="form.email"
            :label="$t('v2.user.emailAddress')"
            placeholder="..."
            :validations="emailFieldValidations"
            pre-icon="$vuetify.icons.mail"
          )
          phone-number-input.invitation-page__content__form-section__input(
            v-model="form.phone"
            :label="$t('v2.user.phone')"
          )
          base-text-input.invitation-page__content__form-section__input(
            v-model="form.job_title"
            :label="$t('v2.user.position')"
            placeholder="..."
            pre-icon="$vuetify.icons.person"
          )

        v-flex(xs12 md6 lg8).invitation-page__content__role-section
          .invitation-page__content__role-section__workspace-view(
            v-if="mode === modes.workspace"
          )
            workspace-organization-role-selection(
              v-if="defaultWorkspaceRoles.length > 0"
              :workspace="parseInt(workspaceId)"
              :user-roles="defaultWorkspaceRoles"
              :workspace-roles="roles"
              @selectionChange="onWorkspaceRoleSelectionChange"
            )

            .invitation-page__content__role-section__workspace-view__loading-indicator(
              v-if="roles.length === 0"
            )
              v-progress-circular(
                :size="50"
                indeterminate
                color="#15ac2f"
              )

          .invitation-page__content__role-section__internal-view(
            v-if="mode === modes.internal"
          )
            .invitation-page__content__role-section__internal-view__internal-role-section
              v-layout.invitation-page__content__role-section__internal-view__internal-switch(
                row wrap
              )
                v-flex(xs4 md3 lg2)
                  label {{ $t('v2.user.internalUser') }}:
                v-flex(xs8 md9 lg10)
                  base-switch(
                    v-model="isInternalUser"
                  )
              <!-- Internal role selection -->
              v-layout.invitation-page__content__role-section__internal-view__internal-role-select(
                row wrap
                v-show="isInternalUser"
              )
                v-flex(xs4 md3 lg2)
                  label {{ $t('general.role') }}:
                v-flex(xs8 md6 lg4)
                  base-select(
                    v-model="selectedInternalRole"
                    :items="internalRoleOptions"
                    :validations="{ required: true }"
                    :search-enabled="true"
                    :search-placeholder="$t('v2.user.selectRole')"
                  )

            <!-- Workspace role selection -->
            workspace-role-selection(
              :for-invitation="true"
              v-show="!isInternalUser"
              :mode="mode"
              @selectionChange="onWorkspaceRoleSelectionChange"
            )

    .invitation-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSwitch from '@/components/v2/base-switch/base-switch.vue'
import BaseSelect from '@/components/v2/base-select/base-select.vue'
import PhoneNumberInput from '@/components/v2/phone-number-input/phone-number-input'
import { isValidEmail } from '@/utils/form-fields-validation-rules'
import { isValidNumber } from 'libphonenumber-js'
import WorkspaceRoleSelection from './workspace-role-selection'
import WorkspaceOrganizationRoleSelection from './workspace-organization-role-selection'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'invitation-page',
  mixins: [
    NodeSelectionsMixin
  ],
  components: {
    WorkspaceRoleSelection,
    WorkspaceOrganizationRoleSelection,
    BaseButton,
    BaseTextInput,
    BaseSwitch,
    BaseSelect,
    PhoneNumberInput
  },
  props: {
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data () {
    return {
      loading: false,
      roles: [],
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      },
      form: {
        first_name: null,
        last_name: null,
        email: null,
        job_title: null,
        phone: null
      },
      isInternalUser: true,
      selectedInternalRole: null,
      workspaceRoleSelections: {},
      nameFieldValidations: {
        required: {
          message: this.$t('v2.form.fieldMandatory')
        }
      },
      emailFieldValidations: {
        required: {
          message: this.$t('v2.form.fieldMandatory')
        },
        methods: [{
          method: isValidEmail
        }]
      },
      nodeTypes: {
        global: 'global',
        organization: 'organization',
        group: 'group',
        site: 'site',
        workspace: 'workspace'
      },
      system_role_types: {
        administrator: 'administrator'
      }
    }
  },
  mounted () {
    this.fetchRoleList()
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaces', 'userWorkspaceOrganizations']),
    internalRoleOptions () {
      return this.roles.filter(role => {
        return role.allowed_node_types.indexOf(this.nodeTypes.global) > -1
      }).map(role => {
        return {
          key: role.id,
          name: role.title
        }
      }).sort((first, second) => {
        if (first.name.toLowerCase() > second.name.toLowerCase()) {
          return 1
        } else if (second.name.toLowerCase() > first.name.toLowerCase()) {
          return -1
        }

        return 0
      })
    },
    isValid () {
      // Check form validity first
      if (!((this.form.email && isValidEmail(this.form.email)) && (this.form.first_name) && (this.form.last_name))) {
        return false
      }

      if (this.form.phone && !isValidNumber(this.form.phone)) {
        return false
      }

      // If selected internal user, an internal role must be selected
      if (this.mode === this.modes.internal && this.isInternalUser) {
        if (!this.selectedInternalRole) {
          return false
        }
      } else {
        // For non internal users, a valid organization and valid role selections must be made
        if (!_.isEmpty(this.workspaceRoleSelections)) {
          if (!this.workspaceRoleSelections.workspace ||
            (!this.workspaceRoleSelections.roles || this.workspaceRoleSelections.roles.length === 0)) {
            return false
          }

          const roleSelections = this.workspaceRoleSelections.roles
          let isRoleSelectionsValid = (roleSelections.length > 0 && roleSelections.filter(userRole => {
            return userRole.role.id === null || userRole.node.id === null
          }).length === 0)
          if (!isRoleSelectionsValid) {
            return false
          }
        }
      }

      return true
    },
    administratorRole () {
      return this.roles.filter(role => {
        return role.system_role_type === 'administrator'
      })[0]
    },
    defaultWorkspaceRoles () {
      // Set workspace administrator by default on workspace mode
      if (this.administratorRole) {
        return [{
          role: {
            id: this.administratorRole.id,
            system_role_type: this.system_role_types.administrator
          },
          node: {
            id: this.workspaceId
          }
        }]
      }

      return []
    }
  },
  methods: {
    ...mapActions('administration', ['fetchRoles']),
    ...mapActions('user', ['inviteUser']),
    ...mapActions('organization/node', ['fetchOrganizationNodes']),
    fetchRoleList () {
      const filters = {
        page_size: 0
      }
      if (this.mode === this.modes.workspace) {
        filters['workspace'] = this.workspaceId
      } else {
        filters['workspace'] = 0
      }

      this.fetchRoles(filters).then(response => {
        this.$set(this, 'roles', response.data.data)
      })
    },
    onWorkspaceRoleSelectionChange (selection) {
      this.workspaceRoleSelections = selection

      // Set current workspace id by default on workspace mode
      if (this.mode === this.modes.workspace) {
        this.$set(this.workspaceRoleSelections, 'workspace', this.workspaceId)
      }
    },
    onSendClick () {
      const requestData = {
        ...this.form
      }

      if (this.mode === this.modes.internal && this.isInternalUser) {
        requestData['roles'] = [{
          role: {
            id: this.selectedInternalRole
          },
          node: null
        }]
      } else {
        if (!_.isEmpty(this.workspaceRoleSelections)) {
          requestData['workspace'] = this.workspaceRoleSelections.workspace
          requestData['roles'] = this.workspaceRoleSelections.roles
        }
      }

      this.loading = true
      this.inviteUser(requestData).then(response => {
        // Display success message and go back to user listing
        global.toastr['success'](this.$t('v2.user.invitationSuccess'), this.$t('general.success'))
        this.onBackClick()
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.USER_INVITATION_SENT)
    },
    onBackClick () {
      this.$router.go(-1)
    },
    onCancelClick () {
      this.onBackClick()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/base.scss";
  @import "styles/v2/colors.scss";

  .invitation-page {
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
      padding: 44px 40px;
      box-sizing: border-box;

      &__form-section {
        border-bottom: 1px solid $gray-xlight;
        padding-bottom: 50px;

        @media (min-width: 992px) {
          padding-right: 50px;
          border-bottom: 0;
          padding-bottom: 0;
          border-right: 3px solid $gray-xlight;
        }
      }

      &__role-section {
        margin-top: 40px;

        @media (min-width: 992px) {
          padding-left: 38px;
          margin-top: 0;
        }

        &__organization-view {
          label {
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 30px;
            color: $text-dark;
          }
        }

        &__workspace-view {
          position: relative;

          &__loading-indicator {
            position: absolute;
            left: 0;
            top: 60px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.6);
          }
        }

        &__internal-view {
          label {
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 30px;
            color: $text-medium;
          }

          &__internal-role-section {
            padding-bottom: 22px;
            margin-bottom: 28px;
            border-bottom: 1px solid $gray-xlight;
          }

          &__internal-role-select {
            margin-top: 15px;

            label {
              line-height: 40px;
            }
          }
        }

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
