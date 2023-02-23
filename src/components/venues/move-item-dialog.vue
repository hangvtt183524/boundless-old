<template lang="pug">
  base-dialog(
    :show="show"
    @close="close"
    max-width="500"
  )
    h2.dialog-heading.mb-3 {{dialogHeading}}
    node-select(
      :indent-level="0"
      :items="filteredList"
      :label="$t('settings.selectGroup')"
      hide-details
      v-model="selected"
    )
    v-layout.pt-3.text-xs-right(row)
      v-flex(xs12)
        v-btn(
          :disabled="!selected"
          :loading="loading"
          @click="moveItems"
          color="success"
          large
          round
        ) {{$t('general.move')}}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { NODE_LIST_CHANGE_EVENT } from '@/constants/events'

import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'

import NodeSelect from '@/components/common/node-select'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  props: ['show', 'item', 'flatList', 'selectedItems'],
  data () {
    return {
      selected: null,
      loading: false,
      selectedNodeIds: []
    }
  },
  mixins: [
    ManageableNodesMixin
  ],
  components: {
    NodeSelect
  },
  methods: {
    ...mapActions('organization/venue', ['moveSelectedItems', 'toggleMoveDialog']),
    close () {
      this.selected = null
      this.$emit('close')
    },
    moveItems () {
      this.loading = true
      let successMessage = (this.selectedItems.length > 1) ? this.$t('venue.itemsMovedMessage') : this.$t('venue.itemMovedMessage')

      this.moveSelectedItems(this.selected).then(() => {
        this.loading = false
        global.toastr['success'](successMessage, this.$t('general.success'))
        this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
        this.toggleMoveDialog()
        this.selected = null
      }).catch(err => {
        this.loading = false
        this.toggleMoveDialog()
        global.toastr['error'](err.response.data.error.message, this.$t('general.error'))
      })

      EventTracker.sendEvent(EVENT_NAMES.VENUE_MOVED)
    },
    filterChildNodeIds (items) {
      items.map(item => {
        this.selectedNodeIds.push(item.id)
        if (item.children) {
          this.filterChildNodeIds(item.children)
        }
      })
    }
  },
  watch: {
    selectedItems () {
      this.selectedNodeIds = []
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    selectedType () {
      for (let item of this.selectedItems) {
        return item.type
      }
      return null
    },
    orgAndGroups () {
      return this.getNodesByType(['organization', 'group'])
    },
    filteredList () {
      this.filterChildNodeIds(this.selectedItems)
      return this.orgAndGroups.filter(node => !this.selectedNodeIds.includes(node.value))
    },
    dialogHeading () {
      if (this.selectedItems.length) {
        let deleteMessage = `Move "${this.selectedItems[0].name}" to`

        if (this.selectedItems.length > 1) {
          deleteMessage = `Move ${this.selectedItems.length} ${this.selectedItems[0].type}s to`
        }

        return deleteMessage
      }

      return 'Delete Item'
    }
  }
}
</script>
