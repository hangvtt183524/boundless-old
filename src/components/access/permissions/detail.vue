<template lang="pug">
  .vendor-role-detail-page.page-content
    .vendor-role-detail-page__header
      .vendor-role-detail-page__header__back-link-container
        v-icon.vendor-role-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.vendor-role-detail-page__header__page-title
        | {{ isExistingVendorRole ? originalVendorRole.name : $t('v2.access.newVendorRole') }}
      .vendor-role-detail-page__header__actions
        base-button.base-button--green.vendor-role-detail-page__header__actions__action(
          v-if="isChangeEnabled"
          @click="onSaveClick"
          :disabled="!isValueChanged || !isValid"
        )
          | {{ isExistingVendorRole ? $t('general.saveChanges') : $t('administration.createRole') }}

    .vendor-role-detail-page__content
      .vendor-role-detail-page__content__section.meta-section
        v-layout(row wrap)
          v-flex.vendor-role-detail-page__content__section__column(xs12 md6 lg3 xl2)
            base-text-input(
              v-model="vendorRole.name"
              :label="$t('v2.access.enterNameForRole')"
              :placeholder="$t('v2.access.roleName')"
              :disabled="!isChangeEnabled"
              :validations="{ required: true }"
            )
          v-flex.vendor-role-detail-page__content__section__column(xs12 lg9 xl10)
            base-multi-select.base-multi-select--nowrap(
              v-model="vendorRole.hidden_sections"
              :items="sectionOptions"
              :label="$t('v2.access.selectSectionsToHide')"
            )

      .vendor-role-detail-page__content__section.actions-section
        role-access-selection(
          :value="getVendorPermissions(vendor)"
          @input="onVendorPermissionsInput(vendor, $event)"
          :vendor="vendor"
          :is-fixed="!isChangeEnabled"
          :is-existing-role="!!vendorRoleId || isExistingVendorRole"
        )

    .vendor-role-detail-page__loading-indicator(
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
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import RoleAccessSelection from './role-access-selection'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'

export default {
  name: 'vendor-role-detail',
  components: {
    BaseMultiSelect,
    RoleAccessSelection,
    BaseButton,
    BaseTextInput
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  props: {
    vendorRoleId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      vendorRole: {},
      originalVendorRole: {},
      vendor: 'meraki', // Fixed for now
      fullAccessValue: 'full',
      sectionOptions: ['help', 'search', 'view_all_networks', 'create_networks'].map(item => {
        return {
          key: item,
          name: this.$t(`v2.access.sections.${item}`)
        }
      })
    }
  },
  mounted () {
    if (this.vendorRoleId) {
      this.fetchCurrentVendorRole()
    } else {
      this.$set(this, 'vendorRole', this.getEmptyVendorRole())
      this.$set(this, 'originalVendorRole', this.getEmptyVendorRole())
    }
  },
  computed: {
    isExistingVendorRole () {
      return this.vendorRole && this.vendorRole.id
    },
    isChangeEnabled () {
      if (this.isExistingVendorRole && this.vendorRole.workspace === null) {
        // Can not modify global vendor roles
        return false
      }

      const permission = this.isExistingVendorRole
        ? 'access_control__edit_vendor_role'
        : 'access_control__create_vendor_role'
      return this.hasPermission(permission, this.workspaceId)
    },
    isValid () {
      return !!this.vendorRole.name
    },
    isValueChanged () {
      return !_.isEqual(this.vendorRole, this.originalVendorRole)
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchVendorRole', 'createVendorRole', 'updateVendorRole']),
    fetchCurrentVendorRole () {
      this.loading = true
      this.fetchVendorRole({
        id: this.vendorRoleId
      }).then(response => {
        this.$set(this, 'vendorRole', response.data.data)
        this.$set(this, 'originalVendorRole', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    getEmptyVendorRole () {
      return {
        name: '',
        permissions: [],
        hidden_sections: this.sectionOptions.map(option => option.key), // All selected by default
        workspace: this.workspaceId
      }
    },
    getVendorPermissions (vendor) {
      const vendorPermissions = this.vendorRole.permissions
        ? this.vendorRole.permissions.find(rootEntity => rootEntity.key === vendor)
        : null

      return vendorPermissions || {
        key: vendor,
        access: this.fullAccessValue,
        children: []
      }
    },
    onVendorPermissionsInput (vendor, value) {
      const existingPermissions = (this.vendorRole.permissions ? this.vendorRole.permissions : [])
      let updatedPermissions

      if (value && value.children && value.children.length > 0) {
        // Entity selected
        updatedPermissions = existingPermissions.find(child => child.key === value.key)
          ? existingPermissions.map(rootEntity => {
            return rootEntity.key === vendor ? value : rootEntity
          })
          : existingPermissions.concat([value])
      } else {
        // Entity de-selected
        updatedPermissions = existingPermissions.filter(child => child.key !== vendor)
      }

      // If root entity already part of permission selection value, replace it with new value.
      // Otherwise add it to permissions
      this.$set(this.vendorRole, 'permissions', updatedPermissions)
    },
    onSaveClick () {
      let saveMethod
      if (this.isExistingVendorRole) {
        // Updating an existing role
        saveMethod = this.updateVendorRole
      } else {
        // Creating a new role
        saveMethod = this.createVendorRole
      }

      this.loading = true
      saveMethod(this.vendorRole).then(response => {
        this.$set(this, 'vendorRole', response.data.data)
        this.$set(this, 'originalVendorRole', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.permissions.roleSaveSuccess'), this.$t('general.success'))

        // Go back to listing page
        this.$router.push({ name: 'AccessVendorRoleList' })
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

.vendor-role-detail-page {
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
  .vendor-role-detail-page {
    &__content {
      height: calc(100vh - 180px);

      &__section {
        &__column:last-child {
          padding-left: 30px;
        }
      }

      .actions-section {
        height: calc(100% - 150px);

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
