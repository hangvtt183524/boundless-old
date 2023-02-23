<template lang="pug">
  .top-group-site-selector(
    data-test="top-group-site-selector"
    v-click-outside="hideMenu"
  )
    .top-group-site-selector__selection-trigger(
      @click="onSelectionTriggerClick"
    )
      span.top-group-site-selector__selection-trigger__node-name
        | {{ selectedOrganization.id === selectedNode.id ? $t('general.allVenues') : selectedNode.name }}
      span.top-group-site-selector__splitter
      v-icon.top-group-site-selector__selection-trigger__icon(
        v-if="!menuVisible"
      ) arrow_drop_down
      v-icon.top-group-site-selector__selection-trigger__icon(
        v-if="menuVisible"
      ) arrow_drop_up
    transition( name="slide")
      .top-group-site-selector__organization-menu-container(
        v-if="menuVisible"
      )
        base-text-input.base-text-input--small.top-group-site-selector__search-input(
          :placeholder="$t('organization.searchVenues')"
          v-model="search"
        )
          v-icon.top-group-site-selector__search-input__icon search
        perfect-scrollbar.top-group-site-selector__scroll-area
          .all-venues-selector(
            v-show="isCompleteTree"
            :class="{'all-venues-selector--active': nodeId === nodeTree[0].id}"
            @click="onSelectNode(nodeTree[0])"
          )
            | {{ $t('general.allVenues') }}
          .top-group-site-selector__node-menu
            group-site-selector-menu-item(
              v-for="node in nodeTree[0].children",
              :key="node.id"
              :node="node"
              :selected-node-id="nodeId"
              :name-filter="search"
              @nodeSelect="onSelectNode"
            )

</template>

<script>
import arrayToTree from 'array-to-tree'
import { mapGetters, mapActions } from 'vuex'
import briefcaseIcon from '@/components/icons/briefcase'
import folderIcon from '@/components/icons/folder'
import venuesLogoIcon from '@/components/icons/venues-logo-icon'
import groupFolderIcon from '@/components/icons/group-folder-icon'
import folderIconClosed from '@/components/icons/folder-closed'
import mapMarkerIcon from '@/components/icons/map-marker'
import floorIcon from '@/components/icons/floor'
import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import GroupSiteSelectorMenuItem from './group-site-selector-menu-item.vue'

import NodeSelect from '@/components/common/node-select'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: {
    indentLevel: {
      type: Number,
      default: 1
    }
  },
  components: {
    briefcaseIcon,
    folderIcon,
    mapMarkerIcon,
    folderIconClosed,
    groupFolderIcon,
    floorIcon,
    venuesLogoIcon,
    NodeSelect,
    BaseTextInput,
    GroupSiteSelectorMenuItem
  },
  mixins: [
    ManageableNodesMixin,
    NodeSelectionsMixin
  ],
  data () {
    return {
      selectedItem: null,
      menuVisible: false,
      search: ''
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode', 'userOrganizationNodes']),
    nodes () {
      return this.getNodesByType(['organization', 'group', 'site'])
    },
    isCompleteTree () {
      return this.userOrganizationNodes.length > 0 && this.userOrganizationNodes[0].type === 'organization'
    },
    nodeTree () {
      if (this.isCompleteTree) {
        return arrayToTree(
          this.userOrganizationNodes.filter(item => {
            return ['organization', 'group', 'site'].includes(item.type)
          }).map(item => {
            const node = { ...item, parent_id: item.parent }
            delete node.parent
            return node
          }), {})
      } else {
        // If manageable node list is not complete organization tree, display items as a flat list
        return [{
          children: this.userOrganizationNodes
        }]
      }
    }
  },
  methods: {
    ...mapActions('layout', ['selectNode']),
    onSelectionTriggerClick () {
      this.menuVisible = !this.menuVisible
    },
    hideMenu () {
      this.menuVisible = false
    },
    indent (level) {
      return { transform: `translate(${(level - this.indentLevel) * 25}px)` }
    },
    onSelectNode (node) {
      this.selectNode(node)
      this.redirectToNode(this.selectedOrganization, node.id)
      this.hideMenu()

      EventTracker.sendEvent(EVENT_NAMES.VENUE_CHANGED)
    }
  },
  watch: {
    menuVisible (newValue) {
      if (!newValue) {
        this.search = ''
      }

      this.$emit('menuDisplayStateChange', newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .top-group-site-selector {
    width: 100%;

    &__splitter {
      border-right: solid 2px #e2e8f1;
      margin: 7px 0 7px 45px;
      width: 1px;
      height: 40px;
      float: right;
    }

    &__organization-menu-container {
      background-color: #FFF !important;
      box-shadow: 0px 16px 40px rgba(0, 0, 0, 0.1);
    }

    &__selection-trigger {
      padding: 0 0 0 45px;
      cursor: pointer;
      line-height: 55px;
      overflow: hidden;
      user-select: none;

      &__node-name {
        font-family: Overpass;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        letter-spacing: 1px;

        color: $text-dark;
        float: left;

        max-width: 85%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &__icon {
        float: right;
        margin-top: 13px;
        color: $gray-medium !important;
      }
    }

    &__scroll-area {
      height: calc(100vh - 140px);
    }

    .all-venues-selector {
      height: 36px;
      padding-left: 45px;

      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 36px;
      color: $text-dark;
      cursor: pointer;

      &:hover:not(.all-venues-selector--active) {
        background: rgba( $blue-reserve, .3);
      }

      &--active {
        background-color: #1146AE;
        color: #FFF;
        font-weight: bold;
      }
    }

    &__search-input {
      &__icon {
        color: $text-dark !important;
        right: 12px !important;
      }
    }

    .base-text-input ::v-deep {
      input {
        background: $gray-xlight;
        height: 51px;
        color: $text-dark;
        border: none;
        padding: 9px 54px 9px 45px;
        border-radius: 0;

        &::placeholder {
          color: $text-dark !important;
        }

        &:focus {
          border-color: $green-light;
        }
      }

      .v-icon {
        opacity: 1;
        right: 34px !important;
      }
    }

    .slide-enter-active {
      transition-duration: 0.5s;
      transition-timing-function: cubic-bezier(.25,.8,.5,1);
    }

    .slide-leave-active {
      transition-duration: 0s;
      transition-timing-function: linear;
    }

    .slide-enter-to, .slide-leave {
      max-height: 600px;
      overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
      overflow: hidden;
      max-height: 0;
    }

    ::v-deep {
      .ps .ps__rail-y:hover, .ps .ps__rail-y:focus, .ps .ps__rail-y.ps--clicking {
        background: transparent;
      }
    }
  }
</style>
