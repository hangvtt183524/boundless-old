<template lang="pug">
  base-modal(
    class="single-user-removal-confirm-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.single-user-removal-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.single-user-removal-confirm-modal__title
              | {{ $t('general.warning') }}

    template(v-slot:default)
      div.single-user-removal-confirm-modal__content__description
        | {{ $t('v2.access.singleUserRemoveConfirmDescription').replace('{user_email}', organizationUser.email) }}

      div.single-user-removal-confirm-modal__content
        .single-user-removal-confirm-modal__content__organization_name
          | {{ organizationUser.organization_name }}

      div.single-user-removal-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .single-user-removal-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--danger"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doRemoveSingle') }}
            base-button(
              class="base-button--danger--negative"
              @click="close"
            ) {{ $t('general.cancel') }}
          v-flex(xs12)
            .single-user-removal-confirm-modal__footer__sub-warning
              | {{ $t('general.operationCanNotBeUndone') }}
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'single-user-removal-confirm-modal',
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
      organizationUser: {}
    }
  },
  methods: {
    open (organizationUser) {
      this.show = true
      this.organizationUser = organizationUser

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

  .single-user-removal-confirm-modal {
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
