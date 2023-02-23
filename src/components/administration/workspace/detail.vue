<template lang="pug">
  .workspace-detail-page.page-content
    .workspace-detail-page__header
      .workspace-detail-page__header__back-link-container
        v-icon.workspace-detail-page__header__back-link-container__back-icon(
          @click="onBackClick"
        ) keyboard_backspace
      h4.workspace-detail-page__header__page-title
        | {{ isExistingWorkspace ? originalWorkspace.name : $t('v2.workspaces.newWorkspace') }}
      .workspace-detail-page__header__actions
        base-button.base-button--green.workspace-detail-page__header__actions__action(
          @click="onSaveClick"
          :disabled="!isValueChanged || !isValid"
        )
          | {{ isExistingWorkspace ? $t('general.saveChanges') : $t('general.create') }}

    .workspace-detail-page__content
      .workspace-detail-page__content__section.meta-section
        v-container(grid-list-lg)
          v-layout(row wrap)
            v-flex(xs12 md6 lg3 xl2)
              base-text-input(
                v-model="workspace.name"
                :label="$t('general.name')"
              )

    .workspace-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import BaseButton from '@/components/v2/base-button/base-button'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

export default {
  name: 'workspace-detail',
  components: {
    BaseTextInput,
    BaseButton
  },
  mixins: [
    UserPermissionsMixin,
    NodeSelectionsMixin
  ],
  props: {
    workspaceItemId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      workspace: {},
      originalWorkspace: {}
    }
  },
  mounted () {
    if (this.workspaceItemId) {
      this.fetchCurrentWorkspace()
    } else {
      this.$set(this, 'workspace', this.getEmptyWorkspace())
      this.$set(this, 'originalWorkspace', this.getEmptyWorkspace())
    }
  },
  computed: {
    isExistingWorkspace () {
      return this.workspace && this.workspace.id
    },
    isValid () {
      return !!this.workspace.name
    },
    isValueChanged () {
      return !_.isEqual(this.workspace, this.originalWorkspace)
    }
  },
  methods: {
    ...mapActions('workspace', ['retrieveWorkspace', 'createWorkspace', 'updateWorkspace']),
    fetchCurrentWorkspace () {
      this.loading = true
      this.retrieveWorkspace({
        id: this.workspaceItemId
      }).then(response => {
        this.$set(this, 'workspace', response.data.data)
        this.$set(this, 'originalWorkspace', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    getEmptyWorkspace () {
      return {
        name: ''
      }
    },
    onSaveClick () {
      let saveMethod
      let creating = false
      if (this.isExistingWorkspace) {
        // Updating an existing workspace
        saveMethod = this.updateWorkspace
      } else {
        // Creating a new workspace
        saveMethod = this.createWorkspace
        creating = true
      }

      this.loading = true
      saveMethod(this.workspace).then(response => {
        this.$set(this, 'workspace', response.data.data)
        this.$set(this, 'originalWorkspace', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.workspaces.workspaceSaveSuccess'), this.$t('general.success'))

        if (creating) {
          this.onWorkspaceCreate()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    onWorkspaceCreate () {
      // Re-fetch workspaces, select Workspace and redirect to it after creation
      this.fetchUserWorkspaces().then(() => {
        this.selectWorkspace(this.workspace)

        // Redirect to workspace
        this.redirectToNode(this.workspace)
      })
    },
    onBackClick () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .workspace-detail-page {
    background-color: $white;
    position: relative;

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px 0 0;
      overflow: hidden;

      &__back-link-container {
        float: left;
        width: 60px;
        line-height: 60px;
        border-right: 1px solid $gray-xlight;
        text-align: center;

        &__back-icon {
          color: $blue-reserve;
          line-height: 60px;
        }
      }

      &__page-title {
        margin-left: 33px;
        line-height: 60px;
        letter-spacing: 1px;
        float: left;
      }

      &__actions {
        float: right;

        &__action {
          margin: 10px 0 0 13px;
          width: 180px;
        }
      }
    }

    &__content {
      box-sizing: border-box;
      padding: 30px 40px;
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

  @media (min-width: 1264px) {
    .workspace-detail-page {
      &__content {
        height: calc(100vh - 180px);
      }
    }
  }
</style>
