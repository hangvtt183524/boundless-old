<template lang="pug">
  .add-user-to-workspace
    workspace-role-selection(
      :key="resetCount"
      @selectionChange="onRoleSelectionChange"
    )
    .add-user-to-workspace__actions
      base-button.base-button--blue.add-button(
        @click="onAddClick"
        :disabled="!isValid"
      ) {{ $t('v2.user.addToWorkspace') }}
      base-button.base-button--blue--negative(
        @click="onCancelClick"
      ) {{ $t('general.cancel') }}
</template>

<script>
import BaseButton from '@/components/v2/base-button/base-button.vue'
import WorkspaceRoleSelection from './workspace-role-selection'

export default {
  name: 'add-user-to-workspace',
  props: {
    workspaceRoles: {
      type: Array,
      required: true
    }
  },
  components: {
    WorkspaceRoleSelection,
    BaseButton
  },
  data () {
    return {
      loading: false,
      resetCount: 0,
      userRoles: []
    }
  },
  computed: {
    isValid () {
      if (this.userRoles.length === 0) {
        return false
      }

      let isValid = true
      this.userRoles.forEach(roleData => {
        if (roleData.role.id === null || !roleData.node || roleData.node.id === null) {
          isValid = false
        }
      })

      return isValid
    }
  },
  methods: {
    reset () {
      this.$set(this, 'userRoles', [])
      this.resetCount += 1
    },
    onAddClick () {
      this.$emit('addClick', this.userRoles)
    },
    onCancelClick () {
      this.reset()
      this.$emit('cancelClick')
    },
    onRoleSelectionChange (roleSelections) {
      this.$set(this, 'userRoles', roleSelections.roles)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .add-user-to-workspace {
    padding: 40px 35px;
    background-color: $gray-xlight;

    &__actions {
      margin-top: 30px;

      .base-button {
        margin-right: 30px;

        &.add-button {
          width: 180px;
        }
      }
    }
  }
</style>
