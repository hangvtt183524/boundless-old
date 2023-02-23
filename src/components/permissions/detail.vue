<template lang="pug">
  .role-detail-page.page-content(
    :class="`role-detail-page--${mode}`"
  )
    .role-detail-page__header
      .role-detail-page__header__back-link-container
        v-icon.role-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.role-detail-page__header__page-title
        | {{ isExistingRole ? originalRole.title : $t('v2.permissions.newRole') }}
      .role-detail-page__header__actions
        base-button.base-button--green.role-detail-page__header__actions__action(
          v-if="isChangeEnabled"
          @click="onSaveClick"
          :disabled="!isValueChanged || !isValid"
        )
          | {{ isExistingRole ? $t('general.saveChanges') : $t('general.create') }}

    .role-detail-page__content
      .role-detail-page__content__section.meta-section
        v-container(grid-list-lg)
          v-layout(row wrap)
            v-flex(xs12 md6 lg3 xl2)
              base-text-input(
                :disabled="!isChangeEnabled"
                v-model="role.title"
                :label="$t('v2.permissions.nameOfRole')"
              )
            v-flex(xs12 md6 lg9 xl10)
              base-text-input(
                :disabled="!isChangeEnabled"
                v-model="role.description"
                :label="$t('general.description')"
              )

      .role-detail-page__content__section.actions-section
        v-container(grid-list-xl).actions-section__container
          .actions-section__title
            | {{ $t('v2.permissions.access') }}
          v-layout(row wrap).actions-section__container__layout
            v-flex.actions-section__categories-container(xs12 md6 lg3 xl2)
              perfect-scrollbar.actions-section__categories-scroll-holder(
                :options="{ suppressScrollX: true }"
              )
                ul.actions-section__action-categories
                  li.actions-section__action-categories__category(
                    v-for="category of actionCategories"
                    :key="category.key"
                    :class="{'actions-section__action-categories__category--selected': selectedCategory === category.key}"
                    @click="onCategoryClick(category)"
                  )
                    base-check-box(
                      :value="isCategorySelected(category)"
                      :disabled="!isChangeEnabled"
                      @click="onCategorySelectClick(category)"
                    )
                    label.actions-section__action-categories__category__label
                      | {{ category.title }}

            v-flex(xs12 md12 lg9 xl10).actions-section__sections
              perfect-scrollbar.actions-section__sections__scroll-holder(
                :options="{ suppressScrollX: true }"
              )
                v-container(grid-list-lg)
                  v-layout(row wrap)
                    v-flex(xs12 md6)
                      .actions-section__section-column.first
                        action-section-item(
                          v-for="section of selectedCategorySectionsEven"
                          :key="section"
                          :section="section"
                          :actions="actionSections[section].actions"
                          :selected-actions="role.actions"
                          :disabled="!isChangeEnabled"
                          @actionSelectionChange="onActionSelectionChange"
                        )

                    v-flex(xs12 md6)
                      .actions-section__section-column.second
                        action-section-item(
                          v-for="section of selectedCategorySectionsOdd"
                          :key="section"
                          :section="section"
                          :actions="actionSections[section].actions"
                          :selected-actions="role.actions"
                          :disabled="!isChangeEnabled"
                          @actionSelectionChange="onActionSelectionChange"
                        )

    .role-detail-page__loading-indicator(
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
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import ActionSectionItem from './action-section-item'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'role-detail',
  components: {
    ActionSectionItem,
    BaseTextInput,
    BaseButton,
    BaseCheckBox,
    BaseSwitch
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    roleId: {
      type: Number,
      required: false
    },
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data: function () {
    return {
      loading: false,
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      },
      role: {},
      originalRole: {},
      actionCategories: [
        {
          key: 'workspace',
          title: this.$t('v2.permissions.workspace'),
          sections: ['workspace_users', 'workspaces', 'roles', 'audit_logs']
        },
        {
          key: 'captivePortal',
          title: this.$t('v2.permissions.captivePortal'),
          sections: ['organizations', 'venues', 'devices', 'templates', 'campaigns', 'media_library',
            'wifi_deployment', 'wifi_settings', 'sponsored_access', 'ticketing', 'wifi_access_codes',
            'ldap_settings', 'saml_settings', 'captive_portal_analytics', 'connected_visitors']
        },
        {
          key: 'networkManagement',
          title: this.$t('v2.permissions.networkManagement'),
          sections: ['network_templates', 'network_client_monitoring',
            'network_device_monitoring', 'network_monitoring', 'network_security', 'network_tags', 'network_names',
            'network_configurations']
        },
        {
          key: 'access_control',
          title: this.$t('v2.permissions.accessControl'),
          sections: ['access_control']
        },
        {
          key: 'syslog',
          title: this.$t('v2.permissions.logs'),
          sections: ['syslog']
        },
        {
          key: 'deployment',
          title: this.$t('v2.permissions.deployment'),
          sections: ['network_deployment']
        }
      ],
      selectedCategory: 'workspace'
    }
  },
  mounted () {
    this.fetchActions()

    if (this.roleId) {
      this.fetchCurrentRole()
    } else {
      this.$set(this, 'role', this.getEmptyRole())
      this.$set(this, 'originalRole', this.getEmptyRole())
    }
  },
  computed: {
    ...mapGetters('administration', ['actions']),
    actionSections () {
      const actionSections = {}

      this.actions.forEach(action => {
        if (actionSections.hasOwnProperty(action.section)) {
          actionSections[action.section].actions.push(action)
        } else {
          actionSections[action.section] = {
            actions: [action]
          }
        }
      })

      return actionSections
    },
    isExistingRole () {
      return this.role && this.role.id
    },
    selectedCategorySections () {
      return this.actionCategories.filter(category => {
        return category.key === this.selectedCategory
      })[0].sections
    },
    selectedCategorySectionsEven () {
      return this.selectedCategorySections.filter((section, index) => {
        return index % 2 === 0
      })
    },
    selectedCategorySectionsOdd () {
      return this.selectedCategorySections.filter((section, index) => {
        return index % 2 === 1
      })
    },
    isValid () {
      return this.role.title && this.role.actions.length > 0
    },
    isValueChanged () {
      return !_.isEqual(this.role, this.originalRole)
    },
    permissionCheckNodeId () {
      return this.workspaceId
    },
    isChangeEnabled () {
      if (!this.isExistingRole) {
        // Always visible for create
        return true
      }

      if (this.role.workspace === null && this.mode === this.modes.workspace) {
        // Whatever the user permissions, can not modify global roles on workspace view
        return false
      }

      return this.hasPermission('roles__edit',
        this.mode === this.modes.internal ? null : this.permissionCheckNodeId)
    }
  },
  methods: {
    ...mapActions('administration', ['fetchRole', 'fetchActions', 'createRole', 'updateRole']),
    fetchCurrentRole () {
      this.loading = true
      this.fetchRole({
        roleId: this.roleId
      }).then(response => {
        this.$set(this, 'role', response.data.data)
        this.$set(this, 'originalRole', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    getEmptyRole () {
      const role = {
        title: '',
        description: '',
        actions: []
      }

      if (this.mode === this.modes.workspace) {
        role['workspace'] = this.workspaceId
        role['allowed_node_types'] = ['site', 'group', 'organization', 'workspace']
      } else {
        role['workspace'] = null
        role['allowed_node_types'] = ['site', 'group', 'organization', 'workspace', 'global']
      }

      return role
    },
    getCategoryActions (category) {
      let actions = []

      for (let i = 0; i < category.sections.length; i++) {
        const sectionKey = category.sections[i]
        if (this.actionSections.hasOwnProperty(sectionKey)) {
          actions = actions.concat(this.actionSections[sectionKey].actions)
        }
      }

      return actions
    },
    isCategorySelected (category) {
      // A category is selected if all actions under it are added to the role
      const categoryActions = this.getCategoryActions(category)
      for (let i = 0; i < categoryActions.length; i++) {
        if (this.role.actions.map(action => {
          return action.action.id
        }).indexOf(categoryActions[i].id) === -1) {
          return false
        }
      }

      return true
    },
    onCategoryClick (category) {
      this.selectedCategory = category.key
    },
    onCategorySelectClick (category) {
      const categoryActions = this.getCategoryActions(category)

      if (!this.isCategorySelected(category)) {
        // Select all actions inside a category
        for (let i = 0; i < categoryActions.length; i++) {
          if (this.role.actions.map(action => {
            return action.action.id
          }).indexOf(categoryActions[i].id) === -1) {
            this.role.actions.push({
              action: categoryActions[i]
            })
          }
        }
      } else {
        // De-select all actions inside a category
        for (let i = 0; i < categoryActions.length; i++) {
          const existingActionIndex = this.role.actions.map(action => {
            return action.action.id
          }).indexOf(categoryActions[i].id)

          if (existingActionIndex > -1) {
            this.role.actions.splice(existingActionIndex, 1)
          }
        }
      }

      // Select category for display
      this.selectedCategory = category.key
    },
    onActionSelectionChange (action, isSelected) {
      if (isSelected) {
        if (this.role.actions.filter(actionItem => {
          return actionItem.action.id === action.id
        }).length === 0) {
          this.role.actions.push({
            action: action
          })
        }
      } else {
        const existingAction = this.role.actions.filter(actionItem => {
          return actionItem.action.id === action.id
        })[0]

        if (existingAction) {
          this.role.actions.splice(this.role.actions.indexOf(existingAction), 1)
        }
      }
    },
    postSaveRedirect () {
      if (this.mode === this.modes.workspace) {
        this.$router.push({ name: 'Roles' })
      } else if (this.mode === this.modes.internal) {
        this.$router.push({ name: 'InternalRoles' })
      }
    },
    onSaveClick () {
      let saveMethod
      if (this.isExistingRole) {
        // Updating an existing role
        saveMethod = this.updateRole
        EventTracker.sendEvent(EVENT_NAMES.CUSTOM_ROLE_MODIFIED)
      } else {
        // Creating a new role
        saveMethod = this.createRole
        EventTracker.sendEvent(EVENT_NAMES.CUSTOM_ROLE_CREATED)
      }

      this.loading = true
      saveMethod(this.role).then(response => {
        this.$set(this, 'role', response.data.data)
        this.$set(this, 'originalRole', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.permissions.roleSaveSuccess'), this.$t('general.success'))

        this.postSaveRedirect()
      }).finally(() => {
        this.loading = false
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

  .role-detail-page {
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

      &__section {
        padding: 30px 40px;

        &:first-child {
          border-bottom: 3px solid $gray-xlight;
        }
      }

      .actions-section {
        &__title {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 18px;
          line-height: 26px;
          letter-spacing: 1px;
          color: $text-dark;
        }

        &__action-categories {
          list-style: none;
          padding-left: 0;

          padding-bottom: 20px;
          border-bottom: 3px solid $gray-xlight;
          margin-bottom: 20px;

          &__category {
            height: 40px;
            padding: 10px;
            box-sizing: border-box;
            cursor: pointer;

            .base-check-box {
              vertical-align: middle;
            }

            &__label {
              font-family: Fira Sans;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 20px;
              color: $text-dark;
              margin-left: 15px;
              user-select: none;
              vertical-align: middle;
              cursor: pointer;

              display: inline-block;
              width: calc(100% - 35px);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            &--selected {
              background-color: $blue-dark;

              .actions-section__action-categories__category__label {
                color: $white;
              }
            }
          }
        }

        .action-section-item {
          margin-bottom: 80px;
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

  @media (min-width: 1264px) {
    .role-detail-page {
      &__content {
        height: calc(100vh - 180px);

        .actions-section {
          height: calc(100% - 178px);

          &__container {
            height: 100%;

            &__layout {
              height: 100%;
            }
          }

          &__sections {
            height: 100%;

            &__scroll-holder {
              height: 100%;
            }
          }

          &__categories-container {
            height: 100%;
          }

          &__categories-scroll-holder {
            height: 100%;
          }

          &__action-categories {
            padding-bottom: 0;
            border-bottom: 0;
            margin-bottom: 0;
          }

          &__section-column {
            padding: 0 30px;
            height: 100%;

            &.first {
              border-right: 3px solid $gray-xlight;
            }
          }
        }
      }
    }
  }
</style>
