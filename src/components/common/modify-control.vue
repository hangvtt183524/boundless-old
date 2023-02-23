<template lang="pug">
  .modify-control
    v-menu(
      offset-y
      transition="slide-y-transition"
      :close-on-content-click="false"
      :open-on-click="false"
      bottom
      v-model="openModifyMenu"
    )
      v-btn(
        slot="activator"
        color="indigo"
        class="white--text"
        @click="showModifyMenu"
        :disabled="!selectedItems.length"
      ) {{ $t('inventory.editDialog')}}
      v-list.modify-menu(v-if="menuType === 'list'")
        v-list-tile(
          v-for="(item, index) in modifyList"
          :key="index"
          @click="clickMenuList(item)"
        )
          v-list-tile-content
            v-list-tile-title {{ item.title }}
      v-card.pa-4.move-item(v-if="menuType === 'move'")
        h3.pb-3 {{ moveDialogHeading }}
        node-select(
          :items="nodesWithGroupsDisabled"
          :label="$t('settings.selectSite')"
          :indent-level="0"
          clearable
          single-line
          hide-details
          search-enabled
          v-model="targetNode"
        )
        v-card-actions.pt-5
          v-btn(
            color="success"
            outline
            large
            round
            @click="menuType = 'list'"
          ) {{ $t('general.back') }}
          v-spacer
          v-btn(
            :disabled="!targetNode"
            class="white--text"
            round
            large
            color="success"
            @click="move"
          ) {{ $t('general.move') }}

      v-card.pa-4.remove-item(v-if="menuType === 'remove'")
        h3.pb-3 {{ removeDialogHeading }}
        h4 {{ $t('general.confirmText') }}
        v-card-actions.pt-4
          v-btn.remove-back(
            outline
            round
            large
            @click="menuType = 'list'"
          ) {{ $t('general.back') }}
          v-spacer
          v-btn(
            class="white--text"
            round
            large
            color="red"
            @click="remove"
          ) {{ $t('general.remove') }}
      v-card.pa-4.remove-item(v-if="menuType === 'delete'")
        h3.pb-3 {{ deleteDialogHeading }}
        h4.pb-2(v-if="!isAssociated || isSelectedTotal") {{ $t('general.deleteItemsToOrgConfirm', {type: name}) }}
        h4 {{ isAssociated && !isSelectedTotal ? $t('general.itmsAssociatedText', {associatedToName: associated.name}) : $t('general.confirmText') }}
        v-card-actions.pt-4
          v-btn.remove-back(
            outline
            round
            large
            @click="menuType = 'list'"
          ) {{ $t('general.back') }}
          v-spacer
          v-btn(
            v-if="isAssociated && !isSelectedTotal"
            class="white--text"
            round
            large
            color="success"
            @click="showModifyMenu"
          ) {{ $t('general.close') }}
          v-btn(
            v-else
            class="white--text"
            round
            large
            color="red"
            @click="onDelete"
          ) {{ $t('general.deleteItems', {type: `${name}s`}) }}
      v-card.pa-4.move-item(v-if="menuType === 'tags'")
        h3.pb-3 {{ addTagsDialogHeading }}
        tags-input(
          v-model="tags"
        )
        v-card-actions.pt-4
          v-btn(
            color="success"
            outline
            large
            round
            @click="menuType = 'list'"
          ) {{ $t('general.back') }}
          v-spacer
          v-btn(
            :disabled="!tags.length"
            class="white--text"
            large
            color="success"
            @click="addTags"
            round
        ) {{ $t('inventory.addTagDialog') }}
</template>

<script>
import MoveDeviceMixin from '@/mixins/move-device.mixin'
import tagsInput from './tags-input'
export default {
  mixins: [
    MoveDeviceMixin
  ],

  components: {
    tagsInput
  },

  props: {
    name: {
      type: String,
      default: ''
    },
    associated: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectedItems: {
      type: Array,
      required: true
    },
    isSelectedTotal: {
      type: Boolean,
      default: false
    },
    totalItems: {
      type: Number,
      default: 0
    },
    modifyList: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      menuType: 'list',
      tags: [],
      openModifyMenu: false
    }
  },
  methods: {
    showModifyMenu () {
      if (this.selectedItems.length) {
        this.menuType = 'list'
        this.tags = []
        this.targetNode = null
        this.openModifyMenu = !this.openModifyMenu
      }
    },
    clickMenuList (item) {
      this.menuType = item.value
    },
    move () {
      this.$emit('move', this.targetNode)
      this.targetNode = null
      this.openModifyMenu = false
      this.menuType = 'list'
    },
    remove () {
      this.$emit('remove')
      this.openModifyMenu = false
      this.menuType = 'list'
    },
    onDelete () {
      this.$emit('delete')
      this.openModifyMenu = false
      this.menuType = 'list'
    },
    addTags () {
      this.$emit('addTags', this.tags)
      this.openModifyMenu = false
      this.menuType = 'list'
    }
  }

}
</script>
<style lang="scss">
.tags {
  max-height: 85px;
  overflow-x: hidden;
  .chip {
    background: #e3ecfc !important;
    color: #4b83f0 !important;
    font-family: 'Fira Sans', sans-serif !important;
  }
}
.modify-menu {
  padding: 10px !important;
  margin: 0 3px 3px 0px !important;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
}
.move-item {
  width: 525px !important;
  margin: 0 3px 3px 0px !important;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
}
.remove-item {
  width: 400px !important;
  margin: 0 3px 3px 0px !important;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  .remove-back {
    color: #9ba9c4 !important;
    border-color: #9ba9c4 !important;
  }
}
</style>
