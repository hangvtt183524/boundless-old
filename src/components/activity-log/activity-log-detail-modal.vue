<template lang="pug">
  base-modal(
    class="activity-log-detail-modal"
    :show="show"
    @close="close"
    max-width="630px"
  )
    template(v-slot:header)
      div.activity-log-detail-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.activity-log-detail-modal__title
              | {{ $t('organization.activityLogDetailTitle') }}

    template(v-slot:default)
      div.activity-log-detail-modal__content
        v-layout(row wrap)
          v-flex(xs6).activity-log-detail-modal__content__state-column
            .activity-log-detail-modal__content__state-column__title
              | {{ $t('general.stateBefore') }}
            pre
              | {{ entity.state_before }}
          v-flex(xs6).activity-log-detail-modal__content__state-column
            .activity-log-detail-modal__content__state-column__title
              | {{ $t('general.stateAfter') }}
            pre
              | {{ entity.state_after }}
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'

export default {
  components: {
    BaseModal
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    entity: {
      type: Object,
      required: true
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

  .activity-log-detail-modal {
    position: relative;

    &__header { }

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 26px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: $blue-dark;
    }

    &__content {
      margin-top: 35px;

      &__state-column {
        overflow: hidden;

        &__title {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 26px;
          color: $text-medium;
          margin-bottom: 35px;
        }

        &:first-child {
          border-right: 3px solid $gray-xlight;
          padding-right: 40px;
        }

        &:last-child {
          padding-left: 40px;
        }
      }
    }
  }

</style>
