<template lang="pug">
  base-modal(
    class="security-checks-failure-info-modal"
    :show="show"
    @close="close"
    max-width="640px"
  )
    template(v-slot:header)
      div.security-checks-failure-info-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.security-checks-failure-info-modal__title
              | {{ $t('v2.organization.settings.securityChecksFailureTitle').replace('{organization_name}', selectedOrganization.name) }}

    template(v-slot:default)
      div.security-checks-failure-info-modal__content
        v-layout(row wrap)
          v-flex(xs12)
            ul
              li(
                v-for="(value, check) in userSecurityChecks.failed_checks"
                :key="check"
              )
                | {{ $t('v2.organization.securityCheckErrors.' + check).replace('{value}', value) }}

    template(v-slot:footer)
      div.security-checks-failure-info-modal__footer
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
import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    ...mapGetters('workspace', ['userSecurityChecks'])
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

  .security-checks-failure-info-modal {
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

      li {
        margin-top: 10px;
      }
    }

    &__footer {
      margin-top: 30px;

      .base-button {
        margin-right: 24px;
      }
    }
  }

</style>
