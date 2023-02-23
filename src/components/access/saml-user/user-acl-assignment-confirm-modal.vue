<template lang="pug">
  base-modal(
    class="user-acl-assignment-confirm-modal"
    :show="show"
    @close="close"
    max-width="600px"
  )
    template(v-slot:header)
      div.user-acl-assignment-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-acl-assignment-confirm-modal__title
              | {{ $t('general.confirmation') }}

    template(v-slot:default)
      .user-acl-assignment-confirm-modal__content
        .user-acl-assignment-confirm-modal__content__description
          span {{ $t('v2.access.byAddingUser').replace('{user_email}', samlUser.email) }}

        .user-acl-assignment-confirm-modal__content__row
          .user-acl-assignment-confirm-modal__content__row__header(
            @click="organizationsVisible = !organizationsVisible"
          )
            v-icon.user-acl-assignment-confirm-modal__content__row__header__expand-icon
              | {{ organizationsVisible ? 'expand_more' : 'chevron_right' }}
            span.user-acl-assignment-confirm-modal__content__row__header__description
              | {{ $t('v2.access.userWillGainAccessToOrganizations').replace('{organization_count}', organizations.length) }}

          .user-acl-assignment-confirm-modal__content__row__content(
            v-show="organizationsVisible"
          )
            base-table(
              :items="organizations"
              :headers="headers"
            )

    template(v-slot:footer)
      div.user-acl-assignment-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-acl-assignment-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doAddToACLs') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'user-acl-assignment-confirm-modal',
  components: {
    BaseModal,
    BaseButton,
    BaseTable
  },
  props: {
    samlUser: {
      type: Object,
      required: true
    },
    organizations: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      show: false,
      resolve: null,
      reject: null,
      headers: [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ],
      organizationsVisible: false
    }
  },
  methods: {
    open () {
      this.show = true
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

  .user-acl-assignment-confirm-modal {
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
