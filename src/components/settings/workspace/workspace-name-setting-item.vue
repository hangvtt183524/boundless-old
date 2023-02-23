<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.workspace-name-setting-item(
    :is-set-up="null"
    :title="$t('v2.workspaces.settings.renameWorkspaceTitle')"
    :description="$t('v2.workspaces.settings.renameWorkspaceDescription')"
  )
    template(v-slot:actions)
      .workspace-name-setting-item__content
        .workspace-name-setting-item__workspace-name-label(
          v-show="!editing"
        )
          | {{ $t('v2.workspaces.settings.workspaceName') }}:
        span.workspace-name-setting-item__workspace-name-display(
          v-show="!editing"
        ) {{ selectedWorkspace.name }}
      base-text-input(
        v-show="editing"
        v-model="workspaceName"
        :placeholder="$t('v2.workspaces.settings.workspaceName')"
      )
      base-button(
        v-show="!editing"
        class="base-button--green--negative"
        @click="onEditTriggerClick"
      ) {{ $t('user.edit') }}
      base-button(
        v-show="editing"
        class="base-button--green"
        @click="onSaveClick"
        :loading="saving"
      ) {{ $t('general.save') }}

</template>

<script>
import { mapActions } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'workspace-name-setting-item',
  components: {
    BaseButton,
    BaseTextInput,
    SettingItem
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  data: function () {
    return {
      editing: false,
      saving: false,
      workspaceName: null
    }
  },
  mounted () {
    this.workspaceName = this.selectedWorkspace.name
  },
  watch: {
    selectedWorkspace: {
      handler: function () {
        this.workspaceName = this.selectedWorkspace.name
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('workspace', ['updateWorkspace']),
    onEditTriggerClick () {
      this.editing = !this.editing

      if (!this.editing) {
        // Reset workspace name
        this.workspaceName = this.selectedWorkspace.name
      }
    },
    onSaveClick () {
      this.saving = true
      this.updateWorkspace({
        id: this.selectedWorkspace.id,
        name: this.workspaceName
      }).then(response => {
        this.editing = false

        global.toastr['success'](this.$t('v2.workspaces.settings.workspaceRenameSuccess'), this.$t('general.success'))
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .workspace-name-setting-item {

    &__content {
      margin-right: 28px;
      margin-top: 4px;
    }
    &__workspace-name-label {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: $text-medium;
    }

    &__workspace-name-display {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: $text-medium;
    }

    .base-text-input {
      width: 180px;
      margin-right: 36px;
      display: inline-block;
    }

    .base-button {

    }
  }
</style>
