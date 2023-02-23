<template lang="pug">
  base-modal(
    class="user-remove-from-acl-confirm-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.user-remove-from-acl-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-remove-from-acl-confirm-modal__title
              | {{ $t('general.warning') }}

    template(v-slot:default)
      div(
        v-html="$t('v2.access.userRemoveFromACLConfirmation').replace('{user_email}', userEmail).replace('{acl_name}', userVendorRole.name)"
      ).user-remove-from-acl-confirm-modal__content__description

      div.user-remove-from-acl-confirm-modal__content
        .user-remove-from-acl-confirm-modal__content__organization_name
          | {{ organizationName }}

      div.user-remove-from-acl-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-remove-from-acl-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--danger"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doRemoveFromACL') }}
            base-button(
              class="base-button--danger--negative"
              @click="close"
            ) {{ $t('general.cancel') }}
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'user-remove-from-acl-confirm-modal',
  components: {
    BaseModal,
    BaseButton,
    BaseTable
  },
  data: function () {
    return {
      show: false,
      resolve: null,
      reject: null,
      userEmail: '',
      userVendorRole: {}
    }
  },
  computed: {
    organizationName () {
      return this.userVendorRole.nodes && this.userVendorRole.nodes.length > 0
        ? this.userVendorRole.nodes[0].meraki_organization_name : ''
    }
  },
  methods: {
    open (userEmail, userVendorRole) {
      this.show = true
      this.userEmail = userEmail
      this.userVendorRole = userVendorRole

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onConfirmClick () {
      this.resolve(true)
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

  .user-remove-from-acl-confirm-modal {
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
      color: $danger;
      text-transform: uppercase;
      text-align: center;
    }

    &__content {
      &__description {
        text-align: center;
      }

      &__organization_name {
        margin-top: 40px;
        text-transform: uppercase;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        color: $text-medium;
        text-align: center;
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
  }
</style>
