<template lang="pug">
  base-modal(
    class="user-invitation-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.user-invitation-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-invitation-modal__title
              | {{ $t('v2.access.inviteSAMLUsers') }}

    template(v-slot:default)
      div.user-invitation-modal__content
        v-container(grid-list-lg)
          v-layout(row wrap).user-invitation-modal__content__form
            v-flex(xs12)
              base-text-input(
                v-model="email"
                :label="$t('general.email')"
                :validations="emailFieldValidations"
              )
            v-flex(xs6)
              base-text-input(
                v-model="firstName"
                :label="$t('general.firstName')"
                :validations="{ required: true }"
              )
            v-flex(xs6)
              base-text-input(
                v-model="lastName"
                :label="$t('general.lastName')"
                :validations="{ required: true }"
              )

            v-flex(xs12)
              .user-invitation-modal__content__acls-description
                | {{ $t('v2.access.selectACLsForUser') }}

              .user-invitation-modal__content__acls-container
                table-multi-select.table-multi-select--fill-height(
                  v-model="selectedACLs"
                  :items="aclOptions"
                )

    template(v-slot:footer)
      div.user-invitation-modal__footer
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

      div.user-invitation-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

</template>

<script>
import { mapActions } from 'vuex'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import TableMultiSelect from '@/components/v2/table-multi-select/table-multi-select'
import { isValidEmail } from '@/utils/form-fields-validation-rules'

export default {
  name: 'user-invitation-modal',
  components: {
    TableMultiSelect,
    BaseModal,
    BaseButton,
    BaseTextInput
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
      email: null,
      firstName: null,
      lastName: null,
      emailFieldValidations: {
        required: true,
        methods: [{ method: isValidEmail }]
      },
      selectedACLs: [],
      aclOptions: []
    }
  },
  computed: {
    isValid () {
      return !!this.email &&
        !!this.firstName &&
        !!this.lastName &&
        isValidEmail(this.email) &&
        this.selectedACLs.length > 0
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchUserVendorRoles', 'inviteSAMLUser']),
    open () {
      // Reset selections
      this.selectedACLs = []
      this.aclOptions = []
      this.email = null
      this.firstName = null
      this.lastName = null

      this.show = true

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
        page: 1
      }

      this.loading = true
      this.fetchUserVendorRoles(filters).then((response) => {
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
      this.loading = true
      this.inviteSAMLUser({
        workspaceId: this.workspaceId,
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        user_vendor_roles: this.selectedACLs
      }).then(response => {
        global.toastr['success'](this.$t('v2.access.samlUserInviteSuccess'), this.$t('general.success'))

        // Close modal
        this.resolve(true)
        this.show = false
      }).finally(() => {
        this.loading = false
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

  .user-invitation-modal {
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
      width: 480px;
      margin: 0 auto;

      &__description {
        text-align: center;
      }

      &__acls-description {
        margin-top: 20px;
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
      }

      &__acls-container {
        margin-top: 10px;
        height: 200px;
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
