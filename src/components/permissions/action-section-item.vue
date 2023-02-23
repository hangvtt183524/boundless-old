<template lang="pug">
  .action-section-item
    .action-section-item__header
      base-check-box(
        :value="isAllActionsSelected()"
        @click="onSelectAllClick"
        :label="$t('v2.permissions.actionSections.' + section)"
        :disabled="disabled"
      )
    .action-section-item__content
      .action-section-item__content__action(
        v-for="action of actions"
        :key="action.id"
      )
        base-check-box(
          :value="isActionSelected(action)"
          @click="onSelectActionClick(action)"
          :label="$t('v2.permissions.actions.' + action.type)"
          :disabled="disabled"
        )

</template>

<script>
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
export default {
  name: 'action-section-item',
  components: {
    BaseCheckBox
  },
  props: {
    section: {
      type: String,
      required: true
    },
    actions: {
      type: Array,
      required: true
    },
    selectedActions: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isAllActionsSelected () {
      for (let i = 0; i < this.actions.length; i++) {
        if (!this.isActionSelected(this.actions[i])) {
          return false
        }
      }

      return true
    },
    onSelectAllClick () {
      let isSelected
      if (this.isAllActionsSelected()) {
        isSelected = false
      } else {
        isSelected = true
      }

      this.actions.forEach(action => {
        this.$emit('actionSelectionChange', action, isSelected)
      })
    },
    isActionSelected (action) {
      return this.selectedActions.map(action => {
        return action.action.id
      }).indexOf(action.id) > -1
    },
    onSelectActionClick (action) {
      this.$emit('actionSelectionChange', action, !this.isActionSelected(action))
    }
  }
}
</script>

<style lang="scss" scoped>
  .action-section-item {
    &__header {
      margin-bottom: 5px;

      ::v-deep .base-check-box {
        label {
          font-weight: bold;
        }
      }
    }

    &__content {
      &__action {
        margin-top: 10px;
      }
    }
  }
</style>
