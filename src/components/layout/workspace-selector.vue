<template lang="pug">
  v-list.left-toolbar-workspace-menu(data-test="user-menu-list-1" @click.native="stopPropagation")
    v-list-tile.menu-description
      v-list-tile-content
        v-list-tile-title {{ selectedWorkspace.name }}

    .search-container
      base-text-input.base-text-input--small(
        :placeholder="$t('v2.workspaces.searchWorkspaces')"
        v-model="search"
        @click.stop="stopPropagation"
      )
        v-icon.top-org-selector__search-input__icon search

    perfect-scrollbar.workspace-selector__scroll-holder
      v-list-tile(
        v-for="workspace of filteredWorkspaces"
        :key="workspace.id"
        :class="{'menu-item--active': selectedWorkspace.id === workspace.id}"
        @click="onMenuItemClick(workspace)"
        data-test="item-org-settings-general"
      )
        v-list-tile-content
          v-list-tile-title {{ workspace.name }}

</template>

<script>
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'
import matchSorter from 'match-sorter'

export default {
  name: 'workspace-selector',
  mixins: [
    NodeSelectionsMixin
  ],
  components: {
    BaseTextInput
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    filteredWorkspaces () {
      return matchSorter(this.userWorkspaces, this.search.toLowerCase(), { keys: ['name'] })
    }
  },
  methods: {
    onMenuItemClick (workspace) {
      if (workspace.id !== this.workspaceId) {
        // Workspace changed
        this.selectWorkspace(workspace)

        EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_CHANGED)
      }

      // Redirect to organization node
      this.redirectToNode(workspace)

      // Reset search
      this.search = ''
    },
    stopPropagation (event) {
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .left-toolbar-workspace-menu {
    width: 265px !important;

    .search-container {
      margin: 5px 0;

      .base-text-input {
        input {
          background: $blue-light;
          color: $white;

          border: none;
          padding: 9px 54px 9px 31px;
          border-radius: 0;

          &::placeholder {
            color: $white !important;
          }

          &:focus {
            border-color: $green-light;
          }
        }

        .v-icon {
          opacity: 1;
          right: 34px !important;
          color: $white;
        }
      }
    }

    .workspace-selector__scroll-holder {
      height: 180px;
      overflow: hidden;
    }
  }
</style>
