<template lang="pug">
  base-modal(
    class="user-organization-update-confirm-modal"
    :show="show"
    @close="close"
    max-width="600px"
  )
    template(v-slot:header)
      div.user-organization-update-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-organization-update-confirm-modal__title
              | {{ $t('general.confirmation') }}

    template(v-slot:default)
      .user-organization-update-confirm-modal__content
        .user-organization-update-confirm-modal__content__description
          span(
            v-html="$t('v2.access.userOrganizationUpdateConfirmDescription').replace('{user_email}', organizationUser.email)"
          )
          br
          span(
            v-if="networkPermissions.length > 0 || tagPermissions.length > 0"
            v-html="$t('v2.access.userOrganizationUpdateOrganizationAccessDescription').replace('{organization_name}', organizationUser.organization_name)"
          )

        .user-organization-update-confirm-modal__content__row(
          v-if="networkPermissions.length > 0"
        )
          .user-organization-update-confirm-modal__content__row__header(
            @click="networkPermissionsVisible = !networkPermissionsVisible"
          )
            v-icon.user-organization-update-confirm-modal__content__row__header__expand-icon
              | {{ networkPermissionsVisible ? 'expand_more' : 'chevron_right' }}
            span.user-organization-update-confirm-modal__content__row__header__description
              | {{ $t('v2.access.networkAccess') }}

          .user-organization-update-confirm-modal__content__row__content(
            v-show="networkPermissionsVisible"
          )
            base-table(
              :items="networkPermissions"
              :headers="headers"
            )

        .user-organization-update-confirm-modal__content__row(
          v-if="tagPermissions.length > 0"
        )
          .user-organization-update-confirm-modal__content__row__header(
            @click="tagPermissionsVisible = !tagPermissionsVisible"
          )
            v-icon.user-organization-update-confirm-modal__content__row__header__expand-icon
              | {{ tagPermissionsVisible ? 'expand_more' : 'chevron_right' }}
            span.user-organization-update-confirm-modal__content__row__header__description
              | {{ $t('v2.access.tagAccess') }}

          .user-organization-update-confirm-modal__content__row__content(
            v-show="tagPermissionsVisible"
          )
            base-table(
              :items="tagPermissions"
              :headers="headers"
            )

    template(v-slot:footer)
      div.user-organization-update-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-organization-update-confirm-modal__footer__warning
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

export default {
  name: 'user-organization-update-confirm-modal',
  components: {
    BaseModal,
    BaseButton,
    BaseTable
  },
  props: {
    organizationUser: {
      type: Object,
      required: false
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
        },
        {
          text: this.$t('v2.access.privilege'),
          value: 'access',
          cellClass: 'capitalize'
        }
      ],
      networkPermissionsVisible: true,
      tagPermissionsVisible: true
    }
  },
  computed: {
    networkPermissions () {
      return this.organizationUser.networks ? this.organizationUser.networks.map(network => {
        return {
          name: network.meraki_network_name,
          access: network.access
        }
      }) : []
    },
    tagPermissions () {
      return this.organizationUser.tags ? this.organizationUser.tags.map(tag => {
        return {
          name: tag.tag_name,
          access: tag.access
        }
      }) : []
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

  .user-organization-update-confirm-modal {
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
