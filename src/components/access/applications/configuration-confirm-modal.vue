<template lang="pug">
  base-modal(
    class="configuration-confirm-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.configuration-confirm-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.configuration-confirm-modal__title
              | {{ $t('general.confirmation') }}

    template(v-slot:default)
      div.configuration-confirm-modal__content
        div.configuration-confirm-modal__content__description(
          v-if="mode === modes.single"
        )
          | {{ $t('v2.access.samlConfigureConfirmation').replace('{organization_name}', application.name) }}
        div.configuration-confirm-modal__content__description(
          v-if="mode === modes.multiple"
        )
          | {{ $t('v2.access.samlConfigureConfirmationMultiple').replace('{organization_count}', applicationCount) }}

        ul.configuration-confirm-modal__content__actions-list
          li {{ $t('v2.access.enableSSOAuthentication') }}
          li {{ $t('v2.access.addBoundlessAsIDP') }}
          li {{ $t('v2.access.addBoundlessSAMLRole') }}

    template(v-slot:footer)
      div.configuration-confirm-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            .configuration-confirm-modal__footer__warning
              | {{ $t('general.areYouSureToContinue') }}
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onConfirmClick"
            ) {{ $t('v2.access.doConfigure') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

export default {
  name: 'configuration-confirm-modal',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    mode: {
      type: String,
      default: 'single'
    }
  },
  data: function () {
    return {
      modes: {
        single: 'single',
        multiple: 'multiple'
      },
      show: false,
      resolve: null,
      reject: null,
      loading: false,
      application: {},
      applicationCount: 0
    }
  },
  methods: {
    open (application, applicationCount) {
      this.application = application
      this.applicationCount = applicationCount
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

  .configuration-confirm-modal {
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

      &__actions-list {
        width: 400px;
        margin: 0 auto;

        li {
          line-height: 24px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: $text-medium;
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
