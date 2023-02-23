<template lang="pug">
  base-modal(
    class="clone-networks-customizations-modal"
    :show="show"
    @close="close"
    max-width="480px"
  )
    template(v-slot:header)
      div.clone-networks-customizations-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.clone-networks-customizations-modal__title
              | {{ $t('v2.merakiTemplates.customizations') }}

    template(v-slot:default)
      div.clone-networks-customizations-modal__content
        v-layout(row wrap)
          v-flex(xs12)
            base-text-input(
              v-model="customizations.radius_secret"
              :label="$t('v2.merakiTemplates.radiusSecret')"
            )

    template(v-slot:footer)
      div.clone-networks-customizations-modal__footer
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              @click="onSaveClick"
            ) {{ $t('general.save') }}
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ $t('general.cancel') }}

</template>

<script>
import { mapActions } from 'vuex'
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object
    }
  },

  data () {
    return {
      loading: false,
      customizations: {}
    }
  },

  watch: {
    show (v) {
      if (v === true) {
        this.resetForm()
      }
    }
  },

  methods: {
    ...mapActions('workspace/network', ['cloneMerakiNetworks']),
    onSaveClick () {
      this.$emit('close', this.customizations)
    },
    close () {
      this.$emit('close', null)
    },
    resetForm () {
      this.customizations = this.value || {
        'radius_secret': ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .clone-networks-customizations-modal {
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
      margin-top: 30px;
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }
  }

</style>
