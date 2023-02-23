<template lang="pug">
  .user-vendor-role-detail-page.page-content
    .user-vendor-role-detail-page__header
      h4.user-vendor-role-detail-page__header__page-title
        | {{ isExistingUserVendorRole ? originalUserVendorRole.name : $t('v2.access.newAccessControlList') }}
      .user-vendor-role-detail-page__header__step-title(
        v-show="saveState === null"
      )
        | {{ currentStep.title }}

    .user-vendor-role-detail-page__content(
      v-if="initialLoadComplete"
    )
      .user-vendor-role-detail-page__content__steps(
        v-show="saveState === null"
      )
        organization-selection(
          v-show="currentStep.key === 'organization_selection'"
          v-model="parentOrganizations"
          @input="onParentOrganizationsInput"
        )

        scope-selection(
          v-if="currentStep.key === 'scope_selection'"
          v-model="userVendorRole.targets"
          :parent-organizations="parentOrganizations"
        )

        vendor-role-selection(
          v-show="currentStep.key === 'vendor_role_selection'"
          v-model="userVendorRole.vendor_role"
          @vendorRoleDataChange="onVendorRoleDataChange"
        )

        user-selection(
          v-if="currentStep.key === 'user_selection'"
          v-model="userVendorRole.connected_users"
          :user-vendor-role="userVendorRole"
          :existing-users="existingUsersValue"
          :existing-saml-users="existingSAMLUsersValue"
          :users-to-migrate="usersToMigrate"
          :parent-organizations="parentOrganizations"
          @migrateUsersUpdate="onMigrateUsersUpdate"
        )

        acl-confirmation(
          v-show="currentStep.key === 'confirmation'"
          :user-vendor-role="userVendorRole"
          :users-to-migrate="usersToMigrate"
        )

        .user-vendor-role-detail-page__content__steps__metadata-step(
          v-show="currentStep.key === 'metadata'"
        )
          .user-vendor-role-detail-page__content__steps__metadata-step__content
            v-layout(row wrap)
              v-flex(xs12 lg6 xl3)
                base-text-input(
                  v-model="userVendorRole.name"
                  :label="$t('v2.access.whatWillYouNameACL')"
                  :placeholder="$t('v2.access.aclName')"
                  :validations="{ required: true }"
                  ref="nameInput"
                )
            v-layout(row wrap)
              v-flex(xs12 lg6 xl3)
                base-text-area(
                  v-model="userVendorRole.description"
                  :label="$t('v2.access.brieflyDescribeACL')"
                  :placeholder="$t('v2.access.aclDescription')"
                )

      .user-vendor-role-detail-page__content__progress-view(
        v-show="saveState !== null"
      )
        v-progress-circular.user-vendor-role-detail-page__content__progress-view__progress-icon(
          :size="100"
          indeterminate
          color="#15ac2f"
        )
        .user-vendor-role-detail-page__content__progress-view__progress-description
          | {{ $t(`v2.access.saveStates.${saveState}`) }}

    .user-vendor-role-detail-page__footer
      .user-vendor-role-detail-page__footer__actions(
        v-show="saveState === null"
      )
        .user-vendor-role-detail-page__footer__actions__left-actions
          base-button.base-button--green--negative.user-vendor-role-detail-page__footer__actions__action(
            v-show="currentStepNumber > 0"
            @click="onPreviousClick"
          ) {{ currentStep.previousLabel ? currentStep.previousLabel : $t('general.previous') }}

        .user-vendor-role-detail-page__footer__actions__right-actions
          base-button.base-button--green.user-vendor-role-detail-page__footer__actions__action(
            :disabled="!isValid"
            v-show="currentStepNumber < steps.length - 1"
            @click="onNextClick"
          ) {{ currentStep.nextLabel ? currentStep.nextLabel : $t('general.next') }}
          base-button.base-button--green.user-vendor-role-detail-page__footer__actions__action(
            :disabled="!isValid"
            v-show="currentStepNumber === steps.length - 1"
            @click="onSaveClick"
          )
            | {{ isExistingUserVendorRole ? $t('v2.access.yesUpdateACL') : $t('v2.access.yesCreateACL') }}

        .user-vendor-role-detail-page__footer__actions__warning(
          v-if="hasExistingUsers && currentStep.key === 'user_selection'"
        )
          acl-warning-fox(
            :title="$t('v2.access.migratingExistingUsers')"
            :description="$t('v2.access.migratingExistingUsersDescription')"
            :sub-warning="$t('v2.access.migratingExistingUsersWarning')"
          )

    .user-vendor-role-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    job-tracking-modal(
      :persistent="true"
      :status-check-interval="500"
      display-post-run-messages
      ref="jobTrackingModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTextArea from '@/components/v2/base-text-area/base-text-area'
import JobTrackingModal from '@/components/v2/job-tracking-modal/job-tracking-modal.vue'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import ProductOrganizationsMixin from '@/mixins/product-organizations.mixin'
import ScopeSelection from './scope-selection'
import VendorRoleSelection from './vendor-role-selection'
import UserSelection from './user-selection'
import OrganizationSelection from './organization-selection'
import AclConfirmation from './acl-confirmation'
import AclWarningFox from './warning-box'

export default {
  name: 'vendor-role-detail',
  components: {
    AclWarningFox,
    AclConfirmation,
    OrganizationSelection,
    UserSelection,
    VendorRoleSelection,
    ScopeSelection,
    BaseButton,
    BaseTextInput,
    BaseTextArea,
    JobTrackingModal
  },
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin,
    ProductOrganizationsMixin
  ],
  props: {
    userVendorRoleId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      saveStates: {
        configuringOrganizations: 'configuringOrganizations',
        creatingVendorRole: 'creatingVendorRole',
        updatingVendorRole: 'updatingVendorRole',
        creatingUserVendorRole: 'creatingUserVendorRole',
        updatingUserVendorRole: 'updatingUserVendorRole'
      },
      saveState: null,
      initialLoadComplete: false,
      userVendorRole: {},
      originalUserVendorRole: {},
      parentOrganizations: [],
      existingUsers: null,
      existingSAMLUsers: null,
      usersToMigrate: [],
      currentStepNumber: 0,
      steps: [
        {
          key: 'organization_selection',
          title: this.$t('v2.access.selectOrganizations'),
          nextLabel: this.$t('v2.access.nextSelectScope')
        },
        {
          key: 'scope_selection',
          title: this.$t('v2.access.selectScope'),
          nextLabel: this.$t('v2.access.nextSelectPermissions'),
          previousLabel: this.$t('v2.access.backToOrganizationSelection')
        },
        {
          key: 'vendor_role_selection',
          title: this.$t('v2.access.configureAccess'),
          nextLabel: this.$t('v2.access.nextSelectUsers'),
          previousLabel: this.$t('v2.access.backToScopeSelection')
        },
        {
          key: 'user_selection',
          title: this.$t('v2.access.selectUsers'),
          nextLabel: this.$t('v2.access.nextFinalizeACL'),
          previousLabel: this.$t('v2.access.backToPermissionSelection')
        },
        {
          key: 'metadata',
          title: this.$t('v2.access.aclMetadata'),
          nextLabel: this.$t('v2.access.confirmation'),
          previousLabel: this.$t('v2.access.backToUserSelection')
        },
        {
          key: 'confirmation',
          title: this.$t('general.confirmation'),
          previousLabel: this.$t('v2.access.backToACLMetadata')
        }
      ],
      vendorRoleData: null,
      administratorTargetType: 'administrator',
      products: ['access_control']
    }
  },
  mounted () {
    if (this.userVendorRoleId) {
      this.fetchCurrentUserVendorRole()

      // Remove metadata step while editing ACL
      this.steps = this.steps.filter(step => step.key !== 'metadata')
      this.steps.find(step => step.key === 'user_selection').nextLabel = this.$t('v2.access.confirmation')
      this.steps.find(step => step.key === 'confirmation').previousLabel = this.$t('v2.access.backToUserSelection')
    } else {
      this.$set(this, 'userVendorRole', this.getEmptyUserVendorRole())
      this.$set(this, 'originalUserVendorRole', this.getEmptyUserVendorRole())

      this.initialLoadComplete = true
    }

    // For organization / scope selections steps
    this.fetchManageableOrganizations()

    // For role selection step
    this.fetchExistingVendorRoles()
  },
  computed: {
    ...mapGetters('workspace/access', ['vendorRoles']),
    ...mapGetters('workspace', ['manageableOrganizations']),
    currentStep () {
      return this.steps[this.currentStepNumber]
    },
    isExistingUserVendorRole () {
      return this.userVendorRole && this.userVendorRole.id
    },
    isValid () {
      if (this.currentStep.key === 'organization_selection') {
        if (_.isNil(this.parentOrganizations) || _.isEmpty(this.parentOrganizations)) {
          return false
        }
      }

      if (this.currentStep.key === 'scope_selection') {
        if (_.isNil(this.userVendorRole.targets) || _.isEmpty(this.userVendorRole.targets)) {
          return false
        }
      }

      if (this.currentStep.key === 'vendor_role_selection') {
        if (!this.userVendorRole.vendor_role &&
          !(this.vendorRoleData && this.vendorRoleData.name &&
            this.vendorRoleData.permissions && this.vendorRoleData.permissions.length > 0)
        ) {
          return false
        }
      }

      if (this.currentStep.key === 'user_selection') {
        if (!this.userVendorRole.connected_users || this.userVendorRole.connected_users.length === 0) {
          return false
        }
      }

      if (this.currentStep.key === 'metadata') {
        if (!(!!this.userVendorRole.name && !!this.userVendorRole.name.trim())) {
          return false
        }
      }

      return true
    },
    selectedVendorRole () {
      return this.vendorRoles.find(item => item.id === this.userVendorRole.vendor_role)
    },
    isValueChanged () {
      return !_.isEqual(this.userVendorRole, this.originalUserVendorRole)
    },
    isVendorRoleDataChanged () {
      return !_.isEqual(this.vendorRoleData, this.selectedVendorRole)
    },
    selectedParentOrganizations () {
      return this.manageableOrganizations
        .filter(organization => this.parentOrganizations.indexOf(organization.meraki_id) > -1)
    },
    selectedParentOrganizationIds () {
      // List of corresponding manageable organization ids for organization Meraki id selections present in
      // parentOrganizations list
      return this.selectedParentOrganizations.map(organization => organization.id)
    },
    existingUsersValue () {
      return this.existingUsers || []
    },
    existingSAMLUsersValue () {
      return this.existingSAMLUsers || []
    },
    hasExistingUsers () {
      const existingUserEmails = this.existingUsersValue.map(user => user.email)
      return this.userVendorRole.connected_users.filter(user => existingUserEmails.indexOf(user.email) > -1).length > 0
    },
    nonImportedOrganizations () {
      const importedOrganizationMerakiIds = this.accessControlOrganizations.map(organization => organization.meraki_organization.meraki_id)
      return this.selectedParentOrganizations.filter(organization => importedOrganizationMerakiIds.indexOf(organization.meraki_id) === -1)
    }
  },
  watch: {
    selectedParentOrganizationIds: {
      handler () {
        // If existing user list was loaded, re-load on selected organization list change
        if (this.existingUsers !== null) {
          // Reset existing users so that it will be re-fetched when opening user selection step
          this.existingUsers = null
        }
      },
      deep: true
    },
    currentStep () {
      if (this.currentStep.key === 'metadata') {
        // Auto-set focus on name element on switch to metadata step
        setTimeout(() => {
          this.$refs.nameInput.setFocus()
        }, 50)
      }
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchVendorRoles', 'fetchUserVendorRole', 'createUserVendorRole',
      'updateUserVendorRole', 'createVendorRole', 'configureSAMLIDP', 'fetchSAMLUsers']),
    ...mapActions('workspace', ['fetchWorkspaceManageableOrganizations']),
    ...mapActions('workspace/network', ['getMerakiExternalEntities']),
    ...mapActions('workspace/organization', ['importWorkspaceMerakiOrganizations']),
    ...mapActions('layout', ['fetchUserWorkspaceOrganizations']),
    fetchCurrentUserVendorRole () {
      this.loading = true
      this.fetchUserVendorRole({
        workspaceId: this.workspaceId,
        id: this.userVendorRoleId
      }).then(response => {
        // Set userVendorRole with aggregated connected user list
        this.$set(this, 'userVendorRole', response.data.data)
        this.$set(this.userVendorRole, 'connected_users', this.userVendorRole.users.concat(this.userVendorRole.user_invitations))
        this.$set(this, 'originalUserVendorRole', JSON.parse(JSON.stringify(this.userVendorRole)))

        this.setInitialParentOrganizations()

        this.initialLoadComplete = true
      }).finally(() => {
        this.loading = false
      })
    },
    fetchExistingVendorRoles () {
      const filters = {
        page_size: 0,
        workspace: this.workspaceId
      }
      if (this.userVendorRoleId) {
        filters.user_vendor_role = this.userVendorRoleId
      }

      this.fetchVendorRoles(filters).then(response => {
        // If vendor role provided in query string, set it
        if (this.$route.query.vendorRole && this.vendorRoles.find(role => role.id === this.$route.query.vendorRole)) {
          this.$set(this.userVendorRole, 'vendor_role', this.$route.query.vendorRole)
        }
      })
    },
    fetchManageableOrganizations () {
      const filters = {
        page_size: 0,
        search: this.search,
        workspaceId: this.workspaceId,
        is_imported_external: false
      }

      this.loading = true
      this.fetchWorkspaceManageableOrganizations(filters).finally(() => {
        this.loading = false
      })
    },
    fetchExistingUsers () {
      const filters = {
        api_key_organizations: this.selectedParentOrganizationIds,
        target_types: [this.administratorTargetType]
      }

      this.loading = true
      this.getMerakiExternalEntities({ workspaceId: this.workspaceId, ...filters }).then(response => {
        if (response.data.data.hasOwnProperty(this.administratorTargetType)) {
          // Results returned directly.
          this.existingUsers = _.uniqBy(response.data.data[this.administratorTargetType], 'email')
        } else {
          // A job returned, data needs to be fetched from Meraki. Wait for job completion and call this method again
          this.waitExistingUserFetchJob(response.data.data.id)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    fetchExistingSAMLUsers () {
      this.fetchSAMLUsers({
        workspaceId: this.workspaceId,
        page_size: 0,
        page: 1
      }).then(response => {
        this.existingSAMLUsers = response.data.data
      })
    },
    waitExistingUserFetchJob (jobId) {
      this.$refs.jobTrackingModal.open(
        jobId,
        this.$t('v2.access.fetchingTargetsFromMeraki'),
        this.$t('v2.access.fetchingTargetsFromMerakiDescription')
      ).then(success => {
        if (success) {
          // Re-try to fetch users
          this.fetchExistingUsers()
        }
      })
    },
    getEmptyUserVendorRole () {
      return {
        vendor_role: null,
        connected_users: [],
        targets: [],
        name: null,
        description: null,
        workspace: this.workspaceId
      }
    },
    onNextClick () {
      this.currentStepNumber++

      if (this.currentStep.key === 'user_selection') {
        // If opening user selection step, load existing user list if not loaded before
        if (this.existingUsers === null) {
          this.fetchExistingUsers()
        }

        if (this.existingSAMLUsers === null) {
          this.fetchExistingSAMLUsers()
        }
      }
    },
    onPreviousClick () {
      this.currentStepNumber--
    },
    setInitialParentOrganizations () {
      this.parentOrganizations = _.uniq(this.userVendorRole.targets.map(target => target.meraki_organization.meraki_id))
    },
    onParentOrganizationsInput (parentOrganizations) {
      // Remove any scope selections that are not valid for updated list of parent organizations
      this.userVendorRole.targets =
        this.userVendorRole.targets.filter(target => parentOrganizations.indexOf(target.meraki_organization.meraki_id) > -1)
    },
    onVendorRoleDataChange (vendorRoleObject) {
      this.vendorRoleData = _.cloneDeep(vendorRoleObject)
    },
    onMigrateUsersUpdate (usersToMigrate) {
      this.usersToMigrate = usersToMigrate
    },
    onSaveClick () {
      if (this.isVendorRoleDataChanged) {
        // Save vendor role first
        this.saveVendorRole().then(() => {
          // Save user vendor role, if data changed
          if (this.isValueChanged) {
            this.saveUserVendorRole()
          } else {
            // Call after save handler
            this.postSaveSuccess()
          }
        })
      } else {
        // Directly save user vendor role
        if (this.isValueChanged) {
          this.saveUserVendorRole()
        } else {
          this.postSaveSuccess()
        }
      }
    },
    saveVendorRole () {
      // We do not modify existing vendor roles here. If user selected an existing vendor role and updated it,
      // we'll create new unlisted vendor role
      // Set save state
      this.saveState = this.saveStates.creatingVendorRole

      if (this.vendorRoleData.id) {
        // User selected an existing vendor role and updated it. Create a new, unlisted vendor role
        delete this.vendorRoleData.id
        this.vendorRoleData.is_listed = false
        this.vendorRoleData.name = this.$t('v2.access.customRole')
      }

      return this.createVendorRole(this.vendorRoleData).then(response => {
        // Set vendor role id in userVendorRole
        this.$set(this.userVendorRole, 'vendor_role', response.data.data.id)

        // Set vendorRoleData
        this.$set(this, 'vendorRoleData', response.data.data)
      }).catch(() => {
        // Clear save state
        this.saveState = null
      })
    },
    saveUserVendorRole () {
      // Check if we have organizations that need to be imported
      if (this.nonImportedOrganizations.length > 0) {
        this.importOrganizations().then(() => {
          // Call this method again after importing organizations
          this.saveUserVendorRole()
        })

        return
      }

      // Set save state
      this.saveState = this.isExistingUserVendorRole
        ? this.saveStates.updatingUserVendorRole : this.saveStates.creatingUserVendorRole

      let saveMethod
      if (this.isExistingUserVendorRole) {
        // Updating an existing role
        saveMethod = this.updateUserVendorRole
      } else {
        // Creating a new role
        saveMethod = this.createUserVendorRole
      }

      return saveMethod({
        workspaceId: this.workspaceId,
        ...this.userVendorRole
      }).then(response => {
        // Set userVendorRole with aggregated connected user list
        this.$set(this, 'userVendorRole', response.data.data)
        this.$set(this.userVendorRole, 'connected_users', this.userVendorRole.users.concat(this.userVendorRole.user_invitations))
        this.$set(this, 'originalUserVendorRole', JSON.parse(JSON.stringify(this.userVendorRole)))

        global.toastr['success'](this.$t('v2.access.aclSaveSuccess'), this.$t('general.success'))

        this.postSaveSuccess()
      }).finally(() => {
        // Clear save state
        this.saveState = null
      })
    },
    importOrganizations () {
      return new Promise((resolve, reject) => {
        this.importWorkspaceMerakiOrganizations({
          workspaceId: this.workspaceId,
          workspace_api_key_organizations: this.nonImportedOrganizations.map(organization => organization.id),
          products: this.products
        }).then(response => {
          this.$refs.jobTrackingModal.open(
            response.data.data.id,
            this.$t('organization.connectionProgressTitle'),
            this.$t('organization.connectionProgressDescription')
          ).then(success => {
            if (success) {
              // Re-fetch user organizations, and resolve after they are fetched
              this.fetchUserWorkspaceOrganizations({ workspaceId: this.workspaceId }).then(() => {
                resolve()
              })
            } else {
              reject(new Error('Could not import organizations'))
            }
          })
        })
      })
    },
    deployUserVendorRole () {
      this.loading = true
      this.configureSAMLIDP({
        workspaceId: this.workspaceId,
        targets: _.uniq(this.userVendorRole.targets.map(target => target.meraki_organization.id)),
        users_to_migrate: this.usersToMigrate
      }).then(response => {
        this.$refs.jobTrackingModal.open(
          response.data.data.id,
          this.$t('v2.access.creatingAcl'),
          this.$t('v2.access.creatingAclDescription'),
          this.$t('v2.access.samlConfigurationComplete')
        ).then(success => {
          this.loading = false

          // Redirect to listing page after successful deployment
          this.$router.push({ name: 'AccessUserVendorRoleList' })
        })
      }).finally(() => {
        this.loading = false
      })
    },
    postSaveSuccess () {
      // Clear save state
      this.saveState = null

      // Deploy ACL
      this.deployUserVendorRole()
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

.user-vendor-role-detail-page {
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

    &__step-title {
      margin-left: 10px;
      line-height: 60px;
      float: left;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      color: $text-dark;

      &::before {
        content: '/';
        margin-right: 10px;
      }
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
    padding: 30px 40px 25px 40px;

    &__steps {
      &__metadata-step {
        .base-text-input {
          margin-bottom: 20px;
        }
      }
    }

    &__progress-view {
      width: 480px;
      margin: 120px auto;
      text-align: center;

      &__progress-description {
        margin-top: 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        color: $text-dark;
      }
    }
  }

  &__footer {
    padding: 0 40px 25px 40px;

    &__actions {
      overflow: hidden;

      &__left-actions {
        float: left;
        margin: 36px 60px 36px 0;

        .user-vendor-role-detail-page__footer__actions__action:not(:last-child) {
          margin-right: 10px;
        }
      }

      &__right-actions {
        float: right;
        margin: 36px 0 36px 60px;

        .user-vendor-role-detail-page__footer__actions__action:not(:first-child) {
          margin-left: 10px;
        }

        &__action-area {
          display: inline-block;
          margin-right: 20px;
        }
      }

      &__warning {
        overflow: hidden;
        clear: both;
      }
    }

    .base-button {
      padding: 0 20px;
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
  .user-vendor-role-detail-page {
    &__content {
      height: calc(100vh - 313px);

      &__steps {
        height: 100%;

        &__scope-selection-step {
          height: 100%;

          .scope-selection {
            height: calc(100% - 83px);
          }

          &__info {
            .flex:not(:first-child) {
              padding-left: 20px;
            }
          }
        }
      }
    }

    &__footer {
      &__actions {
        &__warning {
          clear: none;
          max-width: 1200px;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
