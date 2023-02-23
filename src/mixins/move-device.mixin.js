import CurrentOrgMixin from '@/mixins/current-org.mixin'
import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'

import NodeSelect from '@/components/common/node-select'

let MoveDeviceMixin = {
  mixins: [
    CurrentOrgMixin,
    ManageableNodesMixin
  ],
  components: {
    NodeSelect
  },
  data () {
    return {
      targetNode: null,
      loading: false
    }
  },
  methods: {
    getName (itemsLength) {
      if (itemsLength > 1) {
        return `${this.name}s`
      }
      return this.name
    }
  },
  computed: {
    dialogHeading () {
      if (this.selectedItems.length) {
        let message = this.$t('general.moveNodeNameTo', {
          name: this.selectedItems[0].name
        })

        if (this.selectedItems.length > 1) {
          message = this.$t('general.moveSelectedNodesTo', {
            count: this.selectedItems.length, type: 'devices'
          })
        }

        return message
      }
    },
    moveDialogHeading () {
      if (this.selectedItems.length) {
        if (this.isSelectedTotal) {
          return this.$t('general.moveAllItems', { count: this.totalItems, type: this.getName(this.totalItems) })
        } else {
          let message = this.$t('general.moveNodeNameTo', {
            name: this.selectedItems[0].name
          })

          if (this.selectedItems.length > 1) {
            message = this.$t('general.moveSelectedNodesTo', {
              count: this.selectedItems.length, type: this.getName(this.selectedItems.length)
            })
          }
          return message
        }
      }
    },

    removeDialogHeading () {
      if (this.selectedItems.length) {
        if (this.isSelectedTotal) {
          return this.$t('general.removeAllItems', { count: this.totalItems, type: this.getName(this.totalItems) })
        } else {
          let message = this.$t('general.removeNodeNameTo', {
            name: this.selectedItems[0].name
          })
          if (this.selectedItems.length > 1) {
            message = this.$t('general.removeSelectedNodesTo', {
              count: this.selectedItems.length, type: this.getName(this.selectedItems.length)
            })
          }
          return message
        }
      }
    },

    deleteDialogHeading () {
      if (this.selectedItems.length) {
        if (this.isSelectedTotal) {
          return this.$t('general.deleteAllItems', { count: this.totalItems, type: this.getName(this.totalItems) })
        } else {
          let message = ''
          if (this.isAssociated) {
            message = this.$t('general.itemAssociated', {
              name: this.selectedItems[0].name,
              associatedToName: this.associatedItems.length === 1 ? this.associated.name : `${this.associated.name}s`
            })
            if (this.selectedItems.length > 1) {
              message = this.$t('general.itemsAssociated', {
                count: this.selectedItems.length,
                type: this.getName(this.selectedItems.length),
                associatedCount: this.associatedItems.length === 1 ? 'a' : this.associatedItems.length,
                associatedToName: this.associatedItems.length === 1 ? this.associated.name : `${this.associated.name}s`
              })
            }
          } else {
            message = this.$t('general.deleteItemToOrg', {
              name: this.selectedItems[0].name
            })

            if (this.selectedItems.length > 1) {
              message = this.$t('general.deleteItemsToOrg', {
                count: this.selectedItems.length,
                type: this.getName(this.selectedItems.length)
              })
            }
          }

          return message
        }
      }
    },
    associatedItems () {
      return this.selectedItems.filter(item =>
        (typeof item[this.associated.value] === 'string' && item[this.associated.value]) ||
        (typeof item[this.associated.value] === 'object' && !global._.isEmpty(item[this.associated.value]))
      )
    },
    isAssociated () {
      if (
        this.associated &&
        this.associated.value &&
        this.associatedItems.length) {
        return true
      }
      return false
    },

    addTagsDialogHeading () {
      if (this.selectedItems.length) {
        if (this.isSelectedTotal) {
          return this.$t('general.addTagToAllItems', { count: this.totalItems, type: this.getName(this.totalItems) })
        } else {
          let message = this.$t('general.addTagNameTo', {
            name: this.selectedItems[0].name
          })
          if (this.selectedItems.length > 1) {
            message = this.$t('general.addTagSelectedNodesTo', {
              count: this.selectedItems.length, type: this.getName(this.selectedItems.length)
            })
          }
          return message
        }
      }
    },

    nodesWithGroupsDisabled () {
      const nodeTypes = ['organization', 'group', 'site']
      return this.getNodesByType(nodeTypes).map(node => {
        if (node.type === 'group') {
          node.disabled = true
        }
        return node
      })
    }
  }
}

export default MoveDeviceMixin
