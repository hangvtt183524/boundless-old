<template lang="pug">
  base-modal(
    class="no-permissions-info-modal"
    :show="show"
    @close="close"
    max-width="430px"
  )
    template(v-slot:header)
      div.no-permissions-info-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.no-permissions-info-modal__title
              | {{ $t('v2.organization.noPermissionsTitle') }}

    template(v-slot:default)
      div.no-permissions-info-modal__content
        v-layout(row wrap)
          v-flex(xs12)
            .no-permissions-info-modal__content__desctiption
              | {{ $t('v2.organization.noPermissionsDescription') }}

    template(v-slot:footer)
      div.no-permissions-info-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.close') }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

export default {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/v2/colors";

  .no-permissions-info-modal {
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
      margin-top: 16px;
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }
  }

</style>
