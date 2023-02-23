<template lang="pug">
  base-modal(
    class="user-access-update-confirm-modal"
    :show="show"
    @close="close"
    max-width="600px"
  )
    template(v-slot:header)
      div.user-access-update-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-access-update-confirm-modal__title
              | {{ $t('general.confirmation') }}

    template(v-slot:default)
      .user-access-update-confirm-modal__content
        .user-access-update-confirm-modal__content__description
          | {{ $t('v2.access.userAccessUpdateConfirmDescription').replace('{user_email}', user.email) }}

        .user-access-update-confirm-modal__content__row(
          v-if="addedOrganizations.length > 0"
        )
          .user-access-update-confirm-modal__content__row__header(
            @click="addedOrganizationsVisible = !addedOrganizationsVisible"
          )
            v-icon.user-access-update-confirm-modal__content__row__header__expand-icon
              | {{ addedOrganizationsVisible ? 'expand_more' : 'chevron_right' }}
            span.user-access-update-confirm-modal__content__row__header__description
              | {{ $t('v2.access.gainAccessToOrganizations').replace('{count}', addedOrganizations.length) }}

          .user-access-update-confirm-modal__content__row__content(
            v-show="addedOrganizationsVisible"
          )
            base-table(
              :items="addedOrganizations"
              :headers="headers"
              :is-expandable="true"
              :expandable-row-filter="expandableRowFilter"
              :actions-label="$t('v2.access.privileges')"
              item-key="organization"
            )
              template(
                v-slot:row-expand-area='props'
              )
                .user-access-update-confirm-modal__content__row__content__detail-permissions
                  user-organization-detail-permission-list(
                    :organization-user="props.props.item"
                  )

        .user-access-update-confirm-modal__content__row(
          v-if="removedOrganizations.length > 0"
        )
          .user-access-update-confirm-modal__content__row__header(
            @click="removedOrganizationsVisible = !removedOrganizationsVisible"
          )
            v-icon.user-access-update-confirm-modal__content__row__header__expand-icon
              | {{ removedOrganizationsVisible ? 'expand_more' : 'chevron_right' }}
            span.user-access-update-confirm-modal__content__row__header__description
              | {{ $t('v2.access.loseAccessToOrganizations').replace('{count}', removedOrganizations.length) }}

          .user-access-update-confirm-modal__content__row__content(
            v-show="removedOrganizationsVisible"
          )
            base-table(
              :items="removedOrganizations"
              :headers="headers"
            )

    template(v-slot:footer)
      div.user-access-update-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-access-update-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doUpdateAccess') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import UserOrganizationDetailPermissionList from './user-organization-detail-permission-list'

export default {
  name: 'user-access-update-confirm-modal',
  components: {
    UserOrganizationDetailPermissionList,
    BaseModal,
    BaseButton,
    BaseTable
  },
  props: {
    user: {
      type: Object,
      required: false
    },
    addedOrganizations: {
      type: Array,
      required: true
    },
    removedOrganizations: {
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
          value: 'organization_name'
        }
      ],
      addedOrganizationsVisible: false,
      removedOrganizationsVisible: false
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
    },
    expandableRowFilter (item) {
      return (item.tags && item.tags.length > 0) || (item.networks && item.networks.length > 0)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .user-access-update-confirm-modal {
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
          text-align: center;

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
