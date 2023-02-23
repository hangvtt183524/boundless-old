<template lang="pug">
  base-modal(
    class="user-removal-confirm-modal"
    :show="show"
    @close="close"
    max-width="720px"
  )
    template(v-slot:header)
      div.user-removal-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-removal-confirm-modal__title
              | {{ $t('general.warning') }}

    template(v-slot:default)
      div.user-removal-confirm-modal__content__description
        | {{ $t('v2.access.userRemoveConfirmDescription') }}

      div.user-removal-confirm-modal__content
        v-layout.user-removal-confirm-modal__content__row(row wrap)
          v-flex.user-removal-confirm-modal__content__column.users-column(xs12 lg6)
            .user-removal-confirm-modal__content__column__list
              base-table(
                :items="users"
                :headers="usersHeaders"
              )

          v-flex.user-removal-confirm-modal__content__column.users-column(xs12 lg6)
            .user-removal-confirm-modal__content__column__list
              base-table(
                :items="organizations"
                :headers="organizationsHeaders"
              )

    template(v-slot:footer)
      div.user-removal-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-removal-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--danger"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doRemove') }}
            base-button(
              class="base-button--danger--negative"
              @click="close"
            ) {{ $t('general.cancel') }}
          v-flex(xs12)
            .user-removal-confirm-modal__footer__sub-warning
              | {{ $t('general.operationCanNotBeUndone') }}
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'user-removal-confirm-modal',
  components: {
    BaseModal,
    BaseButton,
    BaseTable
  },
  props: {
    users: {
      type: Array,
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
      usersHeaders: [
        {
          text: this.$t('general.user'),
          value: 'email'
        }
      ],
      organizationsHeaders: [
        {
          text: this.$t('general.organization'),
          value: 'name'
        }
      ]
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

  .user-removal-confirm-modal {
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
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
        margin-bottom: 40px;
        text-align: center;
      }

      &__column {
        .base-table {
          max-height: 300px;

          ::v-deep {
            .base-table__scroll-holder {
              height: auto;
              max-height: 300px;

              .base-data-table--fixed-header {
                height: auto;
                max-height: 300px;

                .v-table__overflow {
                  max-height: 300px !important;
                }
              }
            }
          }
        }

        &:first-child {
          padding-right: 10px;
        }

        &:last-child {
          padding-left: 10px;
        }
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
