<template lang="pug">
  base-modal(
    class="wifi-setup-confirm-modal"
    :show="show"
    @close="close"
    max-width="510px"
  )
    template(v-slot:header)
      div.wifi-setup-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.wifi-setup-confirm-modal__title
              | {{ $t('organization.wifiSetupConfirmTitle') }}

    template(v-slot:default)
      div.wifi-setup-confirm-modal__content
        ul.wifi-setup-confirm-modal__content__action-list
          li.wifi-setup-confirm-modal__content__action-list__item
            | {{ $t('organization.addRadiusServers') }}
          li.wifi-setup-confirm-modal__content__action-list__item
            | {{ $t('organization.configureWalledGarden') }}
          li.wifi-setup-confirm-modal__content__action-list__item
            | {{ $t('organization.enableSplashPageAuthentication') }}
          li.wifi-setup-confirm-modal__content__action-list__item
            | {{ $t('organization.setUpSyslogServers') }}

    template(v-slot:footer)
      div.wifi-setup-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onDeployClick"
            ) {{ $t('organization.deployWifi') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

export default {
  name: 'wifi-setup-confirm-modal',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    onDeployClick () {
      // Emit close event with selection
      this.$emit('close', true)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";

  .wifi-setup-confirm-modal {
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
      color: $blue-dark
    }

    &__content {
      padding: 0 40px;

      &__action-list {
        &__item {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 26px;
          color: #4F4F4F;
        }
      }
    }

    &__footer {
      padding: 30px;

      .base-button {
        margin-right: 24px;
        padding: 0 20px;
      }
    }
  }

</style>
