<template lang="pug">
  perfect-scrollbar.acl-confirmation
    .acl-confirmation__header
      .acl-confirmation__header__title
        | {{ $t('general.confirmation') }}

    .acl-confirmation__content
      .acl-confirmation__content__section
        .acl-confirmation__content__section__description
          | {{ $t('v2.access.aclConfirmationDescription') }}
        v-layout(row wrap).acl-confirmation__content__section__content
          v-flex(xs12 md6 lg4).acl-confirmation__content__section__content__column
            base-table(
              :items="users"
              :headers="userTableHeaders"
            )
          v-flex(xs12 md6 lg8).acl-confirmation__content__section__content__column
            base-table(
              :items="organizations"
              :headers="organizationsTableHeaders"
              :is-expandable="true"
              :expand-on-row-click="true"
              :expand-tooltip="$t('v2.access.viewTargets')"
            )
              template(
                v-slot:row-expand-area='props'
              )
                .acl-organization-targets
                  acl-organization-target-list(
                    :targets="getOrganizationTargets(props.props.item.id)"
                  )

      .acl-confirmation__content__section
        .acl-confirmation__content__section__description(
          v-html="$t('v2.access.aclDeployUpdatesDescription')"
        )
        .acl-confirmation__content__section__content
          ul
            li {{ $t('v2.access.enableSAMLForOrganization') }}
            li {{ $t('v2.access.deploySAMLRoleForACL') }}
            li(
              v-if="usersToMigrate.length > 0"
            ) {{ $t('v2.access.deleteEmailLoginAdministrators') }}
              v-layout(row wrap)
                v-flex(xs12 md6)
                  base-table(
                    :items="usersToMigrateItems"
                    :headers="userTableHeaders"
                  )

</template>

<script>
import _ from 'lodash'
import BaseTable from '@/components/v2/base-table/base-table'
import AclOrganizationTargetList from './acl-organization-target-list'

export default {
  name: 'acl-confirmation',
  components: { AclOrganizationTargetList, BaseTable },
  props: {
    userVendorRole: {
      type: Object,
      required: true
    },
    usersToMigrate: {
      type: Array,
      default: () => []
    }
  },
  data: function () {
    return {
      userTableHeaders: [
        {
          text: this.$t('general.user'),
          value: 'email',
          formatter: (value, item) => {
            return `${item.full_name} <${item.email}>`
          }
        }
      ],
      organizationsTableHeaders: [
        {
          text: this.$t('general.organization'),
          value: 'name'
        }
      ]
    }
  },
  computed: {
    users () {
      return this.userVendorRole.connected_users
    },
    usersToMigrateItems () {
      return this.userVendorRole.connected_users.filter(user => this.usersToMigrate.indexOf(user.email) > -1)
    },
    organizations () {
      return _.uniqBy(this.userVendorRole.targets, 'meraki_organization.id').map(target => {
        return {
          name: target.meraki_organization.name,
          id: target.meraki_organization.id
        }
      })
    }
  },
  methods: {
    getOrganizationTargets (organizationId) {
      return this.userVendorRole.targets.filter(target => target.meraki_organization.id === organizationId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.acl-confirmation {
  max-width: 960px;
  margin: 0 auto;

  &__header {
    padding: 30px;
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
  }

  &__content {
    &__section {
      margin-bottom: 80px;

      &__description {
        line-height: 24px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        color: $text-medium;
        margin-bottom: 40px;
      }

      &__content {
        &__column {
          &:first-child {
            padding-right: 10px;
          }

          &:last-child {
            padding-left: 10px;
          }
        }

        .acl-organization-targets {
          padding: 10px;
        }
      }

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

      ul {
        li {
          line-height: 24px;

          .base-table {
            margin-top: 20px;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 1264px) {
  .acl-confirmation {
    height: 100%;
    padding: 0 20px;
  }
}

</style>
