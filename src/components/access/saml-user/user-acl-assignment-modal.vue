<template lang="pug">
  base-modal(
    class="user-acl-assignment-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.user-acl-assignment-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-acl-assignment-modal__title
              | {{ $t('v2.access.addUserToACLs') }}

    template(v-slot:default)
      div.user-acl-assignment-modal__content
        .user-acl-assignment-modal__content__description
          | {{ $t('v2.access.selectACLsToAddUser').replace('{user_email}', samlUser.email) }}
        .user-acl-assignment-modal__content__acls-container
          table-multi-select.table-multi-select--fill-height(
            v-model="selectedACLs"
            :items="aclOptions"
          )

    template(v-slot:footer)
      div.user-acl-assignment-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onContinueClick"
              :disabled="!isValid"
            ) {{ $t('general.continue') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.user-acl-assignment-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

      user-acl-assignment-confirm-modal(
        ref="confirmModal"
        :saml-user="samlUser"
        :organizations="selectedOrganizations"
      )

</template>

<script>
import { mapActions } from 'vuex'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import TableMultiSelect from '@/components/v2/table-multi-select/table-multi-select'
import UserAclAssignmentConfirmModal from './user-acl-assignment-confirm-modal'

export default {
  name: 'user-acl-assignment-modal',
  components: {
    UserAclAssignmentConfirmModal,
    TableMultiSelect,
    BaseModal,
    BaseButton
  },
  props: {
    workspaceId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      show: false,
      resolve: null,
      reject: null,
      loading: false,
      samlUser: {},
      selectedACLs: [],
      acls: [],
      aclOptions: []
    }
  },
  computed: {
    isValid () {
      return this.selectedACLs.length > 0
    },
    selectedOrganizations () {
      const organizations = []

      this.selectedACLs.forEach(aclId => {
        const acl = this.acls.find(acl => acl.id === aclId)
        const organizationName = (acl.targets && acl.targets.length > 0) ? acl.targets[0].meraki_organization_name : null

        if (organizationName && !organizations.find(organization => organization.name === organizationName)) {
          organizations.push({
            name: organizationName
          })
        }
      })

      return organizations
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchUserVendorRoles', 'assignSAMLUserToACLs']),
    open (samlUser) {
      // Reset selections
      this.selectedACLs = []
      this.aclOptions = []

      this.show = true
      this.samlUser = samlUser

      this.fetchACLs()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    fetchACLs () {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: 0,
        page: 1,
        excluded_user: this.samlUser.id
      }

      this.loading = true
      this.fetchUserVendorRoles(filters).then((response) => {
        this.acls = response.data.data
        this.aclOptions = response.data.data.map(acl => {
          return {
            key: acl.id,
            name: acl.name
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onContinueClick () {
      this.$refs.confirmModal.open(
        this.samlUser, this.selectedOrganizations
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.assignSAMLUserToACLs({
            workspaceId: this.workspaceId,
            id: this.samlUser.id,
            user_vendor_roles: this.selectedACLs
          }).then(response => {
            global.toastr['success'](this.$t('v2.access.samlUserACLAssignmentSuccess'), this.$t('general.success'))

            // Close modal
            this.resolve(true)
            this.show = false
          }).catch(() => {
            global.toastr['error'](this.$t('v2.access.samlUserACLAssignmentFailure'), this.$t('general.error'))
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onCancelClick () {
      this.show = false
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .user-acl-assignment-modal {
    position: relative;

    &__header {
      padding: 30px;
    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 25px;
      color: $blue-dark;
      text-transform: uppercase;
      text-align: center;
    }

    &__content {
      &__description {
        text-align: center;
      }

      &__acls-container {
        margin: 20px auto;
        width: 320px;
        height: 300px;
      }
    }

    &__footer {
      padding: 30px;
      text-align: center;

      &__warning, &__sub-warning {
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
        margin-bottom: 20px;
      }

      &__warning {
        margin-bottom: 20px;
      }

      &__sub-warning {
        margin-top: 20px;
      }

      .base-button {
        margin-right: 24px;
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
</style>
