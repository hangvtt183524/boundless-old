<template lang="pug">
  base-modal(
    class="user-invitation-confirm-modal"
    :show="show"
    @close="close"
    max-width="720px"
  )
    template(v-slot:header)
      div.user-invitation-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-invitation-confirm-modal__title
              | {{ $t('general.confirmation') }}

    template(v-slot:default)
      div.user-invitation-confirm-modal__content__description
        | {{ $t('v2.access.userInviteConfirmDescription') }}

      div.user-invitation-confirm-modal__content
        v-layout.user-invitation-confirm-modal__content__row(row wrap)
          v-flex.user-invitation-confirm-modal__content__column.users-column(xs12 lg6)
            .user-invitation-confirm-modal__content__column__list
              base-table(
                :items="users"
                :headers="usersHeaders"
                :is-expandable="true"
                :expandable-row-filter="expandableRowFilter"
                :actions-label="$t('v2.access.privileges')"
                item-key="email"
              )
                template(
                  v-slot:row-expand-area='props'
                )
                  .user-invitation-confirm-modal__content__column__list__detail-permissions
                    user-organization-detail-permission-list(
                      :organization-user="props.props.item"
                      tags-only
                    )

          v-flex.user-invitation-confirm-modal__content__column.users-column(xs12 lg6)
            .user-invitation-confirm-modal__content__column__list
              base-table(
                :items="organizations"
                :headers="organizationsHeaders"
              )

        v-layout.user-invitation-confirm-modal__content__row(
          v-if="existingPairs.length > 0"
          row wrap
        )
          v-flex.user-invitation-confirm-modal__content__column.existing-column(xs12)
            .existing-column__description
              | {{ $t('v2.access.usersAlreadyMembersOfOrganizations') }}
            base-table(
              :items="existingPairs"
              :headers="existingPairsHeaders"
            )

    template(v-slot:footer)
      div.user-invitation-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-invitation-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doInvite') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

      div.user-invitation-confirm-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import { mapActions } from 'vuex'
import UserOrganizationDetailPermissionList from './user-organization-detail-permission-list'

export default {
  name: 'user-invitation-confirm-modal',
  components: {
    UserOrganizationDetailPermissionList,
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
    },
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
      ],
      existingPairsHeaders: [
        {
          text: this.$t('general.user'),
          value: 'email'
        },
        {
          text: this.$t('general.organization'),
          value: 'organization_name'
        }
      ],
      existingPairs: []
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchMerakiOrganizationUserInvitationExistingPairs']),
    open () {
      this.show = true
      this.getExistingParis()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    getExistingParis () {
      this.loading = true
      this.fetchMerakiOrganizationUserInvitationExistingPairs({
        workspaceId: this.workspaceId,
        organizations: this.organizations.map(organization => organization.key),
        emails: this.users.map(user => user.email)
      }).then(response => {
        this.existingPairs = response.data.data.pairs
      }).finally(() => {
        this.loading = false
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

  .user-invitation-confirm-modal {
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

        &.existing-column {
          padding: 0;
          margin-top: 20px;

          .existing-column__description {
            line-height: 24px;
            font-family: Fira Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            color: $text-medium;
            margin-bottom: 20px;
            text-align: center;
          }

          .base-table {
            height: auto;
          }
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
