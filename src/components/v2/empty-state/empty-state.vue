<template lang="pug">
  .empty-state
    .empty-state__content
      .empty-state__loading-indicator(
        v-if="loading"
      )
        v-progress-circular(
          :size="50"
          indeterminate
          color="#15ac2f"
        )

      h3.empty-state__header(
        v-if="headerText"
      )
        |  {{ headerText }}

      .empty-state__message(
        v-if="messageText"
        v-html="messageText"
      )

      .empty-state__actions(
        v-if="actions && actions.length > 0"
      )
        .empty-state__actions__action(
          v-for="action of actions"
          :key="action.key"
        )
          a(
            v-if="action.externalLink"
            :href="action.externalLink"
            target="_blank"
          )
            base-button(
              :class="action.buttonClass ? action.buttonClass : 'base-button--green'"
              @click="$emit('actionClick', action.key)"
              :disabled="!!action.disabled"
            )
              |  {{ action.text }}

          router-link(
            v-else-if="action.internalLink"
            :to="{ name: action.internalLink, query: action.query || {} }"
          )
            base-button(
              :class="action.buttonClass ? action.buttonClass : 'base-button--green'"
              @click="$emit('actionClick', action.key)"
              :disabled="!!action.disabled"
            )
              |  {{ action.text }}

          base-button(
            v-else
            :class="action.buttonClass ? action.buttonClass : 'base-button--green'"
            @click="$emit('actionClick', action.key)"
            :disabled="!!action.disabled"
          )
            |  {{ action.text }}

</template>

<script>
import BaseButton from '@/components/v2/base-button/base-button'

export default {
  name: 'EmptyState',
  components: {
    BaseButton
  },
  props: {
    headerText: {
      type: String
    },
    messageText: {
      type: String
    },
    actions: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style src="./empty-state.scss" lang="scss" scoped></style>
