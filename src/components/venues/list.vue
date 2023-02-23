<template lang="pug">
  .page-content(data-test="venues-list")
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{$t('general.venues')}}
      v-flex.pb-3(
        xs6, md6, lg6, text-xs-right
        v-if="hasPermission('venues__create', selectedOrganization.id)"
      )
        v-btn.primary-action(color='primary', data-test="btn-create-site" @click.stop='onNewSiteClick')
          | {{ $t('general.newSite') }}
          v-icon add_circle_outline
    .venues-list-wrap
      v-layout.group-site-header(row)
        v-flex.group-site-actions(xs6)
          //- span.d-inline-block
          //- v-checkbox(v-model="selectAllSwitch", color="deep-purple lighten-2", hide-details)
          span.ml-2.d-inline-block(v-if="selectedItems.length") {{selectedItems.length}} {{$t('general.itemsSelected')}}
          a.ml-2.d-inline-block(v-if="selectedItems.length", @click="clickDeselectAll") Deselect All
        v-flex.group-site-buttons.text-xs-right.pr-1.pt-1(xs6)
          span.d-inline-block(v-if="hasPermission('venues__create', selectedOrganization.id)")
            v-btn(icon, @click.stop="showAddGroup")
              v-icon create_new_folder
          span.d-inline-block(v-if="hasPermission('venues__edit', selectedOrganization.id)")
            v-btn(icon, @click.stop="toggleMoveDialog", :disabled="!selectedItems.length")
              v-icon fas fa-arrows-alt
          span.d-inline-block(v-if="hasPermission('venues__delete', selectedOrganization.id)")
            v-btn(icon, @click.stop="deleteItem", :disabled="!selectedItems.length")
              v-icon delete
          new-group-dialog(:show="showAddGroupDialog", @close="closeAddGroup" v-if="hasPermission('venues__create', selectedOrganization.id)")
          delete-item-dialog(:show="showDeleteDialog", @close="toggleDeleteDialog" v-if="hasPermission('venues__delete', selectedOrganization.id)")
          new-site-dialog(:show="showNewSiteDialog", @close="closeNewSiteDialog" v-if="hasPermission('venues__create', selectedOrganization.id)")
          warning-dialog(:show="warningPanel.show", @close="closeWarningDialog")
      .venue-progress(v-if="loading")
        v-progress-circular(:size="50" indeterminate color="primary")
      // in the tree
      v-layout(row v-else)
          v-flex(xs12)
            tree(
              :hide-actions="!(hasPermission('venues__edit', selectedOrganization.id) || hasPermission('venues__delete', selectedOrganization.id))"
              :canManage="hasPermission('venues__edit', selectedOrganization.id) || hasPermission('venues__delete', selectedOrganization.id)"
              :tree="orgTree"
            )

      move-item-dialog(
        v-if="hasPermission('venues__edit', selectedOrganization.id)"
        @close="toggleMoveDialog"
        :show="showMoveDialog",
        :flat-list="flatList"
        :selected-items="selectedItems"
      )
      confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import arrayToTree from 'array-to-tree'
import { SITE_ADDED_EVENT, NODE_LIST_CHANGE_EVENT } from '@/constants/events'
import deleteItemMixin from '@/mixins/delete-item.mixin'
import newGroupDialog from './new-group-dialog'
import deleteItemDialog from './delete-item-dialog'
import newSiteDialog from './new-site-dialog'
import tree from './tree'
import moveItemDialog from './move-item-dialog'
import WarningDialog from '@/components/common/warning-dialog'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
import ConfirmDialog from '@/components/common/confirm-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  mixins: [
    deleteItemMixin,
    UserPermissionsMixin,
    NodeSelectionsMixin
  ],
  components: {
    WarningDialog,
    newGroupDialog,
    deleteItemDialog,
    newSiteDialog,
    moveItemDialog,
    ConfirmDialog,
    tree
  },

  data () {
    return {
      active: null,
      showNewSiteDialog: false,
      showFloorsAndDevices: false,
      loading: false,
      updatedNode: false
    }
  },

  mounted () {
    this.fetchOrgData()
  },

  beforeDestroy () {
    this.$eventHub.$off(SITE_ADDED_EVENT)
    this.updateSelectedItems([])
  },

  computed: {
    ...mapGetters(['warningPanel']),
    ...mapGetters('organization/venue', [
      'flatList',
      'selectedItems',
      'showDeleteDialog',
      'showMoveDialog',
      'isTreeLoading',
      'showAddUserDialog',
      'showAddGroupDialog'
    ]),
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode', 'userOrganizationNodes']),
    orgTree () {
      if (!this.updatedNode) {
        return []
      }
      const list = this.getFilteredItems
      return arrayToTree(list)
    },
    getFilteredItems () {
      let list = []
      if (this.showFloorsAndDevices) {
        list = this.userOrganizationNodes
          .filter(item => ['organization', 'group', 'site', 'floor', 'device'].includes(item.type))
          .map(item => {
            const node = { ...item, parent_id: item.parent, selected: false, edit: false }
            if (item.type === 'device') {
              node.draggable = true
              node.droppable = false
            } else {
              node.draggable = true
              node.droppable = true
            }
            delete node.parent
            return node
          })
      } else {
        list = this.userOrganizationNodes
          .filter(item => ['organization', 'group', 'site'].includes(item.type))
          .map(item => {
            const node = { ...item, parent_id: item.parent, selected: false, edit: false }
            if (item.type === 'site') {
              node.draggable = true
              node.droppable = false
            } else {
              node.draggable = true
              node.droppable = true
            }
            delete node.parent
            return node
          })
      }
      return list
    }
  },
  methods: {
    ...mapActions('organization/venue', [
      'updateSelectedItems',
      'selectAll',
      'deselectAll',
      'toggleDeleteDialog',
      'toggleMoveDialog',
      'setTreeLoading',
      'setAddUserDialog',
      'setAddGroupDialog'
    ]),
    fetchOrgData () {
      this.updatedNode = false
      this.fetchCurrentOrganizationManagedNodes().finally(() => {
        this.updatedNode = true
      })
    },
    clickDeselectAll () {
      this.deselectAll()
      this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
    },
    onNewSiteClick () {
      this.showNewSiteDialog = true

      EventTracker.sendEvent(EVENT_NAMES.VENUE_CREATION_STARTED)
    },
    closeNewSiteDialog () {
      this.showNewSiteDialog = false
    },
    showAddGroup () {
      this.updateSelectedItems([{ id: this.$route.params.orgId, name: 'None' }])
      this.setAddGroupDialog(true)
    },
    closeAddGroup () {
      this.updateSelectedItems([])
      this.setAddGroupDialog(false)
    },
    deleteItem () {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('general.venues') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          let hasChildItems = this.selectedItems.filter(d => {
            const childNodes = this.userOrganizationNodes.filter(m => m.parent === d.id)
            return childNodes.length > 0
          })
          if (hasChildItems.length > 0) {
            this.toggleDeleteDialog()
          } else {
            this.removeItems()

            EventTracker.sendEvent(EVENT_NAMES.VENUE_DELETED)
          }
        }
      })
    },
    closeWarningDialog () {
      this.$store.commit('UPDATE_WARNING_PANEL', { message: '', show: false })
    }
  }
}
</script>

<style lang="scss">
  .group-site-header {
    background-color: #f8fafc;
    color: #9ba9c4;

    .v-icon {
      color: #9ba9c4 !important;
    }
  }

  .group-site-actions {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
  .venues-check {
    .input-group {
      min-width: 210px;
    }
  }

  .group-site-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .deselect-link {
    padding-left: 5px;
  }

  .venue-progress {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
  .show-floors-devices {
    padding: 8px 0px;
  }
</style>
