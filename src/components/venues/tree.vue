<template lang="pug">
  .tree
    DraggableTree(:data="treeData" crossTree @change="moveNode")
      div(slot-scope="{data, store}")
        template
          .tree-item(v-if="data.type && !data.hidden" @click="clickTreeItem(store, data, $event)")
            .item-checkbox(v-if="!hideActions")
              v-checkbox(ref="checkboxEl", v-model="data.selected", @change="selectedCheckBox(data)", :disabled="data.disable", color="deep-purple lighten-2", hide-details)
            .item-title(
              :style="indent(data)"
              :class="{'item-title--limited': (data.inventory_summary && data.inventory_summary.length > 0)}"
            )
              .item-title-icon
                itemIcon(:type="data.type", :collapsed="!data.open")
              v-text-field(
                v-if="data.edit && !hideActions"
                autofocus
                :rules="rules"
                :counter="maxLength"
                @blur="saveNodeName(data)"
                @keyup.enter="saveNodeName(data)"
                v-model="nodeName"
              )
              h5(
                v-else
                @click.stop="enableEditName(data)"
                :title="data.name"
              ) {{ data.name }}
            .item-inventory-summary(
              v-if="data.inventory_summary && data.inventory_summary.length > 0"
            )
              .item-inventory-summary__summary-item(
                v-for="deviceInfo of data.inventory_summary"
              )
                span.item-inventory-summary__summary-item__label {{ $t(`inventory.deviceTypes.${deviceInfo.type}`) }}: &nbsp;
                span.item-inventory-summary__summary-item__count {{ deviceInfo.count }}

            .tree-item-actions
              v-menu(left, offset-y)
                v-btn.divider-vert.mx-0(slot="activator", icon)
                  v-icon(small, color='grey') more_horiz
                .row-popover
                  .row-popover-arrow
                  .row-popover-inner
                    v-tooltip(bottom color="#9AA9C4" light)
                      template(v-slot:activator="{ on }")
                        .row-popover-item(
                          v-if="hasPermission('wifi_settings__edit', data.id) && mainNodeTypes.includes(data.type) && !hideActions"
                          @click="goToRoute(data, 'SelfRegistration')"
                          class="wifi-config"
                          v-on="on"
                        )
                          wifi-icon(color="white")
                      span {{ $t('tooltip.wifiConfiguration') }}

                    v-tooltip(bottom color="#9AA9C4" light)
                      template(v-slot:activator="{ on }")
                        .row-popover-item(
                          v-if="hasPermission('connected_visitors__list', data.id) && mainNodeTypes.includes(data.type)"
                          @click="goToRoute(data, 'WifiAnalytics')"
                          v-on="on"
                        )
                          v-icon fas fa-chart-pie
                      span {{ $t('tooltip.wifiAnalytics') }}

                    //- .row-popover-item(
                    //-   @click="addUser(data)"
                    //-   v-if="mainNodeTypes.includes(data.type) && canManage"
                    //- )
                    //-   v-icon fas fa-user-plus

                    v-tooltip(bottom color="#9AA9C4" light)
                      template(v-slot:activator="{ on }")
                        .row-popover-item(
                          v-if="hasPermission('venues__create', selectedOrganization.id) && (data.type === 'group' || data.type === 'organization') && !hideActions"
                          @click="addGroup(data)"
                          v-on="on"
                        )
                          v-icon fas fa-folder-plus
                      span {{ $t('tooltip.newGroup') }}

                    v-tooltip(bottom color="#9AA9C4" light)
                      template(v-slot:activator="{ on }")
                        .row-popover-item(
                          v-if="hasPermission('venues__edit', data.id) && data.type !== 'organization' && !hideActions"
                          @click="moveItem(data)"
                          v-on="on"
                        )
                          v-icon fas fa-arrows-alt
                      span {{ $t('tooltip.move') }}

                    v-tooltip(bottom color="#9AA9C4" light)
                      template(v-slot:activator="{ on }")
                        .row-popover-item(
                          @click="goToSettings(data)"
                          v-if="mainNodeTypes.includes(data.type)"
                          v-on="on"
                        )
                          v-icon fas fa-cog
                      span {{ $t('tooltip.details') }}

                    v-tooltip(bottom color="#9AA9C4" light)
                      template(v-slot:activator="{ on }")
                        .row-popover-item(
                          v-if="hasPermission('venues__delete', data.id) && data.type !== 'organization' && !hideActions"
                          @click="deleteItem(data)"
                          v-on="on"
                        )
                          v-icon delete
                      span {{ $t('tooltip.delete') }}

    v-layout.mt-3(row v-if="loading")
      v-flex.text-xs-center(xs12)
        v-progress-circular(indeterminate color="primary")
    v-layout.mt-3(row v-if="treeCount && currentRows < treeCount && !loading")
      v-flex.text-xs-center(xs12)
        v-btn.btn-default(
          @click="viewMore"
        ) {{ $t('general.viewMore') }} ({{ currentRows }} of {{ treeCount }})
    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { DraggableTree } from 'vue-draggable-nested-tree'
import { mapActions, mapGetters } from 'vuex'
import { NODE_LIST_CHANGE_EVENT } from '@/constants/events'
import WifiIcon from '@/components/icons/wifi'

import itemIcon from './item-icon'
import DeleteItemMixin from '@/mixins/delete-item.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import ConfirmDialog from '@/components/common/confirm-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  components: {
    DraggableTree,
    ConfirmDialog,
    WifiIcon,
    itemIcon
  },
  props: {
    tree: {
      required: true,
      type: Array
    },
    hideActions: {
      type: Boolean,
      default: false
    },
    canManage: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    UserPermissionsMixin,
    NodeSelectionsMixin,
    DeleteItemMixin
  ],
  data () {
    return {
      treeData: [],
      maxLength: 64,
      nodeName: '',
      mainNodeTypes: [
        'organization',
        'group',
        'site'
      ],
      treeCount: 0,
      currentRows: 25,
      loading: true
    }
  },
  mounted () {
    if (this.tree.length) {
      this.currentRows = 25
      this.getTree()
    }
  },
  watch: {
    tree (v) {
      this.currentRows = 25
      this.getTree()
    }
  },
  computed: {
    ...mapGetters('organization/venue', [
      'selectedItems',
      'allNodes'
    ]),
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode', 'userOrganizationNodes']),
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }

        return value.length <= this.maxLength || `Max ${this.maxLength} characters`
      }
      return [maxRule]
    }
  },
  methods: {
    ...mapActions('organization/venue', [
      'updateSelectedItems',
      'deselectAll',
      'toggleDeleteDialog',
      'toggleMoveDialog',
      'setAddUserDialog',
      'setAddGroupDialog'
    ]),
    ...mapActions('organization/node', ['updateNode', 'setSelectedNode']),
    getTree () {
      const data = Object.assign([], this.tree)
      this.treeCount = 0
      this.getTreeFilter(data)
      this.treeData = data
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    getTreeFilter (data) {
      data.map(item => {
        this.treeCount += 1
        if (this.treeCount > this.currentRows) {
          item.hidden = true
        } else {
          item.hidden = false
        }
        if (item.children) {
          this.getTreeFilter(item.children)
        }
      })
    },
    viewMore () {
      this.currentRows += 25
      this.getTree()
    },
    getNode (item) {
      return this.userOrganizationNodes.find(node => node.id === item.id)
    },
    updateTreeData (data, value) {
      const result = data.map(item => {
        if (item.id === value) {
          item = value
          return item
        }
        if (item.children.length) {
          item.children = this.updateTreeData(item.children, value)
        }
        return item
      })
      return result
    },
    clickTreeItem (store, item, e) {
      if (item.children && item.children.length && e.target.className === 'tree-item' && item.type === 'group' && !item.edit) {
        store.toggleOpen(item)
      }
    },
    selectedCheckBox (value) {
      this.changeChildTree(this.treeData, value)
      if (value.selected) {
        const node = this.userOrganizationNodes.find(item => item.id === value.id)
        let newArray = [...this.selectedItems]
        this.selectedItems.map(item => {
          const currentItem = this.findById(value, item.id)
          if (currentItem) {
            const index = newArray.findIndex(newItem => newItem.id === currentItem.id)
            if (index > -1) {
              newArray.splice(index, 1)
            }
          }
        })
        newArray = [...newArray, node]
        this.updateSelectedItems(newArray)
      } else {
        const index = this.selectedItems.map(item => item.id).indexOf(value.id)
        if (index !== -1) {
          let newArray = Object.assign([], this.selectedItems)
          newArray.splice(index, 1)
          this.updateSelectedItems(newArray)
        }
      }
    },

    findById (item, id) {
      if (item.id === id) {
        return item
      }
      let result
      for (let index in item.children) {
        result = this.findById(item.children[index], id)
        if (result) {
          return result
        }
      }
      return result
    },
    changeChildTree (data, value) {
      const currentItem = data.find(item => item.id === value.id)
      if (currentItem) {
        currentItem.children.map(item => {
          item.selected = value.selected
          item.disable = value.selected
          this.changeChildTree(this.treeData, item)
        })
      }
      data.map(item => {
        if (item.children && item.children.length) {
          this.changeChildTree(item.children, value)
        }
      })
    },
    indent (item) {
      return { 'padding-left': `${(item.level) * 50}px` }
    },
    childCount (item) {
      return item.children.length
    },
    goToRoute (item, routeName) {
      const route = {
        name: routeName,
        params: {
          nodeId: item.id
        }
      }
      this.$router.push(route)
    },
    addUser (item) {
      const node = this.getNode(item)
      this.setAddUserDialog(true)
      this.updateSelectedItems([node])
    },
    addGroup (item) {
      const node = this.getNode(item)
      this.updateSelectedItems([node])
      this.setAddGroupDialog(true)
    },
    goToSettings (item) {
      const node = this.getNode(item)
      this.setSelectedNode(node)

      this.$router.push({ name: 'SiteGroupDetail', params: this.routeNodeParameters })

      EventTracker.sendEvent(EVENT_NAMES.VENUE_DETAIL_VIEWED)
    },
    moveItem (item) {
      const node = this.getNode(item)
      this.updateSelectedItems([node])
      this.toggleMoveDialog()
      this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
    },
    deleteItem (item) {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('general.venues') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          if (!item.children || item.children.length < 1) {
            const node = this.getNode(item)
            this.updateSelectedItems([node])
            this.removeItems()

            EventTracker.sendEvent(EVENT_NAMES.VENUE_DELETED)
          } else {
            const node = this.getNode(item)
            this.updateSelectedItems([node])
            this.toggleDeleteDialog()
          }
        }
      })
    },
    enableEditName (item) {
      if (item.type !== 'organization') {
        item.edit = true
        this.nodeName = item.name
        this.updateTreeData(this.treeData, item)
      }
    },
    saveNodeName (item) {
      if (this.nodeName && item.name !== this.nodeName && this.nodeName.length <= this.maxLength) {
        item.name = this.nodeName
        this.updateNode({ nodeId: item.id, name: this.nodeName }).then(response => {
          this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
        })
      } else {
        item.edit = false
        this.updateTreeData(this.treeData, item)
      }
    },
    moveNode (node) {
      if (!node.parent.id) {
        this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
      } else {
        const parentId = node.parent.id
        this.updateNode({ nodeId: node.id, parent: parentId }).then(response => {
          this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import "styles/colors.scss";
.he-tree {
  .tree-node-inner {
    cursor: pointer;
  }
  .tree-node-inner-back {
    padding: 0px !important;
    margin: 0px !important;
  }
  .draggable-placeholder-inner {
    border: 1px dashed $primary;
    box-sizing: border-box;
    background: rgba(#0088F9, 0.09);
    color: #0088f9;
    border-radius: 6px;
    text-align: center;
    padding: 0;
    display: flex;
    align-items: center;
  }
}
.tree-item {
  background-color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  height: 48px;

  .item-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    padding-left: 8px;
    margin-top: -2px;
    .v-input--selection-controls {
      margin: 0px;
      padding: 0px;
    }
  }

  &::before {
    position: absolute;
    content: '';
    left: -8px;
    width: 7px;
    height: calc(100% - 20px);
    top: 10px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    background: #aa85d9;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  &:hover {
    background-color: #ecf8ff !important;
    color: $primary;

    .item-title h5 {
      color: $primary;
    }

    .s-icon {
      color: $primary !important;
    }
  }

  &:hover::before {
    opacity: 1;
  }

  .item-title {
    display: flex;
    align-items: center;
    margin-left: 10px;
    box-sizing: border-box;

    &--limited {
      width: 600px;
    }

    h5 {
      font-weight: normal;
      font-family: 'Fira Sans', sans-serif;
      font-size: 15px;
      color: #0f202f;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      margin-left: 5px;
      font-weight: normal;
      font-family: 'Fira Sans', sans-serif;
      font-size: 15px;
      color: #0f202f;
    }
    .v-text-field {
      width: 175px;
      height: 32px;
      padding: 0px;
      margin: 0px;
      .v-input__control {
        .v-input__slot {
          margin-bottom: 5px;
        }
      }
      input {
        font-size: 15px;
      }
    }
  }

  .item-inventory-summary {
    display: flex;
    align-items: center;

    &__summary-item {
      display: inline-block;
      font-size: 13px;
      width: 150px;

      &__label {
        font-weight: 600;
      }
    }
  }

  .tree-item-actions {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .item-title-icon {
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    .v-icon {
      color: #9EACC6;
    }
  }
}

.input-group--selection-controls.input-group--disabled .icon--selection-control{
  color: #d9d9d9 !important;
}

.wifi-config {
  .s-icon {
    color: #fff !important;
    cursor: pointer;
  }
}

@media only screen and (max-width: 1264px) {
  .tree-item {
    .item-title {

      &--limited {
        width: auto;
      }
    }

    .item-inventory-summary {
      display: none;
    }
  }
}
</style>
