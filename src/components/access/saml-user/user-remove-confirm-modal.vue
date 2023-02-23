<template lang="pug">
  base-modal(
    class="user-remove-confirm-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.user-remove-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.user-remove-confirm-modal__title
              | {{ $t('general.warning') }}

    template(v-slot:default)
      div(
        v-html="$t('v2.access.samlUserRemoveConfirmation').replace('{user_email}', samlUser.email)"
      ).user-remove-confirm-modal__content__description

      div.user-remove-confirm-modal__content
        .user-remove-confirm-modal__content__organizations-container
          base-table(
            :items="organizations"
            :headers="organizationsHeaders"
          )

    template(v-slot:footer)
      div.user-remove-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .user-remove-confirm-modal__footer__warning
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
            .user-remove-confirm-modal__footer__sub-warning
              | {{ $t('general.operationCanNotBeUndone') }}

      div.user-remove-confirm-modal__loading-indicator(v-if="loading")
        v-progress-circular(
          :size="50"
          indeterminate color="#15ac2f"
        )

</template>

<script>
import { mapActions } from 'vuex'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTable from '@/components/v2/base-table/base-table.vue'

export default {
  name: 'user-remove-confirm-modal',
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
      samlUser: {},
      organizations: [],
      organizationsHeaders: [
        {
          text: this.$t('general.organization'),
          value: 'name'
        }
      ]
    }
  },
  methods: {
    ...mapActions('workspace/access', ['fetchSAMLUserOrganizations']),
    open (samlUser) {
      this.show = true
      this.samlUser = samlUser

      this.fetchUserOrganizations()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    fetchUserOrganizations () {
      this.loading = true
      this.fetchSAMLUserOrganizations({
        workspaceId: this.workspaceId,
        id: this.samlUser.id
      }).then(response => {
        this.organizations = response.data.data.connected_organizations
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

  .user-remove-confirm-modal {
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

      &__organizations-container {
        margin: 20px auto;
        width: 320px;
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
