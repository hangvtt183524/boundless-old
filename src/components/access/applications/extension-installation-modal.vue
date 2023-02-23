<template lang="pug">
  base-modal(
    class="extension-installation-modal"
    :show="show"
    @close="close"
    max-width="480px"
  )
    template(v-slot:header)
      div.extension-installation-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.extension-installation-modal__title
              | {{ $t('v2.access.installChromeExtension') }}

    template(v-slot:default)
      div.extension-installation-modal__content
        .extension-installation-modal__content__message(
          v-html="$t('v2.access.installChromeExtensionDescription')"
        )

        .extension-installation-modal__content__action
          a(
            :href="extensionUrl"
            target="_blank"
          )
            base-button(
              class="base-button--green"
            ) {{ $t('v2.access.install') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

export default {
  name: 'extension-installation-modal',
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
  computed: {
    extensionUrl () {
      return `https://chrome.google.com/webstore/detail/boundless-digital-access/${process.env.VUE_APP_RBAC_EXTENSION_ID}`
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .extension-installation-modal {
    position: relative;

    &__header {

    }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__content {
      margin-top: 36px;

      &__action {
        margin-top: 30px;
      }
    }
  }
</style>
