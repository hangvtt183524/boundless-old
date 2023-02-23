<template lang="pug">
  base-modal(
    class="removal-confirm-modal"
    :show="show"
    @close="close"
    max-width="720px"
  )
    template(v-slot:header)
      div.removal-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.removal-confirm-modal__title
              | {{ $t('general.warning') }}

    template(v-slot:default)
      div(
        v-html="$t('v2.access.removeUserVendorRoleConfirmation').replace('{rolename}', userVendorRole.name)"
      ).removal-confirm-modal__content__description

      div.removal-confirm-modal__content(
        v-if="users.length > 0 && organizations.length > 0"
      )
        .removal-confirm-modal__content__description
          | {{ $t('v2.access.removeUserVendorRoleConfirmationDescription').replace('{rolename}', userVendorRole.vendor_role_name) }}

        v-layout.removal-confirm-modal__content__row(row wrap)
          v-flex.removal-confirm-modal__content__column.users-column(xs12 lg6)
            .removal-confirm-modal__content__column__list
              base-table(
                :items="users"
                :headers="usersHeaders"
              )

          v-flex.removal-confirm-modal__content__column.users-column(xs12 lg6)
            .removal-confirm-modal__content__column__list
              base-table(
                :items="organizations"
                :headers="organizationsHeaders"
              )

    template(v-slot:footer)
      div.removal-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .removal-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--danger"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doDeleteAcl') }}
            base-button(
              class="base-button--danger--negative"
              @click="close"
            ) {{ $t('general.cancel') }}
          v-flex(xs12)
            .removal-confirm-modal__footer__sub-warning
              | {{ $t('general.operationCanNotBeUndone') }}

      div.full-screen-loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )
</template>

<script>
import _ from 'lodash'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'removal-confirm-modal',
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
      loading: false,
      usersHeaders: [
        {
          text: this.$t('v2.access.affectedUsers'),
          value: 'email',
          formatter: (value, item) => {
            return `${item.full_name} <${item.email}>`
          }
        }
      ],
      organizationsHeaders: [
        {
          text: this.$t('general.organization'),
          value: 'name'
        }
      ],
      userVendorRole: {}
    }
  },
  computed: {
    organizations () {
      return _.uniq(this.userVendorRole.targets.map(target => target.meraki_organization_name)).map(organizationName => {
        return {
          name: organizationName
        }
      })
    },
    users () {
      return this.userVendorRole.users.concat(this.userVendorRole.user_invitations)
    }
  },
  methods: {
    open (userVendorRole) {
      this.userVendorRole = userVendorRole
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
  @import "styles/v2/base.scss";

  .removal-confirm-modal {
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
