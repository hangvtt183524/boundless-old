<template lang="pug">
  base-modal(
    class="disconnect-confirm-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.disconnect-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.disconnect-confirm-modal__title
              | {{ $t('general.warning') }}

    template(v-slot:default)
      div.disconnect-confirm-modal__content__description
        | {{ $t('v2.access.applicationDisconnectConfirmation').replace('{organization_name}', application.name) }}
        div.disconnect-confirm-modal__content__description__sub
          | {{ $t('v2.access.applicationDisconnectConfirmationSub') }}

      div.disconnect-confirm-modal__content
        .disconnect-confirm-modal__content__affected-acls(
          v-show="organizationACLs && organizationACLs.length > 0"
        )
          .disconnect-confirm-modal__content__affected-acls__description
            | {{ $t('v2.access.followingACLsAffected') }}
          .disconnect-confirm-modal__content__affected-acls__list
            base-table(
              :items="organizationACLs"
              :headers="headers"
            )

      div.disconnect-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .disconnect-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--danger"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doDisconnectOrganization') }}
            base-button(
              class="base-button--danger--negative"
              @click="close"
            ) {{ $t('general.cancel') }}
          v-flex(xs12)
            .disconnect-confirm-modal__footer__sub-warning
              | {{ $t('general.operationCanNotBeUndone') }}

        div.disconnect-confirm-modal__loading-indicator(v-if="loading")
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

export default {
  name: 'disconnect-confirm-modal',
  components: {
    BaseModal,
    BaseButton,
    BaseTable
  },
  props: {
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
      headers: [
        {
          text: this.$t('general.name'),
          value: 'name'
        }
      ],
      application: {},
      organizationACLs: []
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchUserVendorRoles']),
    open (application) {
      this.show = true
      this.application = application
      this.organizationACLs = []

      this.fetchOrganizationACLs()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    fetchOrganizationACLs () {
      const filters = {
        workspaceId: this.workspaceId,
        page_size: 0,
        page: 1,
        organization: this.application.meraki_organization.id
      }

      this.loading = true
      this.fetchUserVendorRoles(filters).then((response) => {
        this.organizationACLs = response.data.data
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .disconnect-confirm-modal {
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

        &__sub {
          font-weight: 600;
        }
      }

      &__affected-acls {
        width: 400px;
        margin: 0 auto;

        &__description {
          line-height: 24px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: $text-medium;
          margin-bottom: 10px;
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
