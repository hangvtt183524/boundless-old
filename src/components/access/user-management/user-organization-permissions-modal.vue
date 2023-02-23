<template lang="pug">
  base-modal(
    class="user-organization-permissions-modal"
    :show="show"
    @close="close"
    max-width="600px"
  )
    template(v-slot:header)
      div.user-organization-permissions-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-organization-permissions-modal__title
              | {{ organizationUser.organization_name ? $t('v2.access.permissionsOnOrganization').replace('{organization_name}', organizationUser.organization_name) : $t('v2.access.detailPermissions') }}

    template(v-slot:default)
      .user-organization-permissions-modal__content
        user-organization-permissions-form(
          v-model="organizationUser"
          :owner-organization-id="ownerOrganizationId"
          @validStateChange="isValid = $event"
          :is-full-screen="true"
          :key="showCounter"
        )

    template(v-slot:footer)
      div.user-organization-permissions-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onSaveClick"
              :disabled="!isValid"
            ) {{ $t('v2.access.set') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import _ from 'lodash'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import UserOrganizationPermissionsForm from './user-organization-permissions-form'

export default {
  name: 'user-organization-permissions-modal',
  components: {
    UserOrganizationPermissionsForm,
    BaseModal,
    BaseButton,
    BaseTable
  },
  data: function () {
    return {
      show: false,
      resolve: null,
      reject: null,
      isValid: false,
      organizationUser: {},
      ownerOrganizationId: null,
      showCounter: 0
    }
  },
  methods: {
    open (organizationUser, ownerOrganizationId) {
      this.organizationUser = _.cloneDeep(organizationUser)
      this.ownerOrganizationId = ownerOrganizationId
      this.showCounter++

      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onSaveClick () {
      this.resolve(this.organizationUser)
      this.show = false
    },
    onCancelClick () {
      this.resolve(false)
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

  .user-organization-permissions-modal {
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
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
        margin-bottom: 40px;
        text-align: center;
      }

      &__row {
        margin-bottom: 40px;

        &__header {
          cursor: pointer;
          text-align: left;
          margin: 0 auto;
          width: 320px;

          &__expand-icon {
            font-size: 18px;
            vertical-align: middle;
            margin-right: 5px;
          }

          &__description {
            vertical-align: middle;
            line-height: 16px;
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            color: $text-medium;
            text-align: center;
          }
        }

        &__content {
          margin: 20px auto;
          width: 320px;
        }
      }

    }

    &__footer {
      padding: 30px;
      text-align: center;

      &__warning {
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
        margin-bottom: 20px;
      }

      .base-button {
        margin-right: 24px;
        padding: 0 20px;
      }
    }
  }

</style>
