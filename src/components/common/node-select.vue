<template lang="pug">
  .node-select
    v-select.tree-style(
      v-if="!searchEnabled"
      :value="value"
      :items="computedNodes"
      @input="$emit('input', $event)"
      :menu-props="{ contentClass:'tree-style' }"
      v-bind="$attrs"
    )
      template(slot="item" slot-scope="data" class="disabled")
        .item-wrap(:style="indent(data.item.level)")
          span
            briefcaseIcon(v-if="data.item.type === 'organization'")
            group-folder-icon(v-else-if="data.item.type === 'group'")
            floor-icon(v-else-if="data.item.type == 'floor'")
            map-marker-icon(v-else)
          span.pre-wrap {{ data.item.text }}

    v-autocomplete.tree-style(
      v-if="searchEnabled"
      :value="value"
      :items="computedNodes"
      @input="$emit('input', $event)"
      :menu-props="{ contentClass:'tree-style' }"
      v-bind="$attrs"
      @blur="$refs.select.isMenuActive = false"
      ref="select"
    )
      template(slot="item" slot-scope="data" class="disabled")
        .item-wrap(:style="indent(data.item.level)")
          span
            briefcaseIcon(v-if="data.item.type === 'organization'")
            group-folder-icon(v-else-if="data.item.type === 'group'")
            floor-icon(v-else-if="data.item.type == 'floor'")
            map-marker-icon(v-else)
          span.pre-wrap {{ data.item.text }}

</template>
<script>
import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'

import briefcaseIcon from '@/components/icons/briefcase'
import folderIcon from '@/components/icons/folder'
import groupFolderIcon from '@/components/icons/group-folder-icon'
import folderIconClosed from '@/components/icons/folder-closed'
import mapMarkerIcon from '@/components/icons/map-marker'
import wifiIcon from '@/components/icons/wifi'
import floorIcon from '@/components/icons/floor'

export default {
  props: {
    value: {
      type: [Number, String],
      default: null
    },
    indentLevel: {
      type: Number,
      default: 1
    },
    items: {
      type: Array,
      default: null
    },
    nodeTypes: {
      type: Array,
      default: () => {
        return [
          'organization',
          'group',
          'site',
          'floor',
          'device'
        ]
      }
    },
    searchEnabled: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    ManageableNodesMixin
  ],
  components: {
    briefcaseIcon,
    folderIcon,
    mapMarkerIcon,
    folderIconClosed,
    wifiIcon,
    floorIcon,
    groupFolderIcon
  },
  computed: {
    computedNodes () {
      if (this.items) {
        return this.items
      }
      return this.getNodesByType(this.nodeTypes)
    }
  },
  methods: {
    indent (level) {
      return { transform: `translate(${(level - this.indentLevel) * 25}px)` }
    }
  }
}
</script>
<style lang="scss" scoped>
.v-menu__content {
  &.tree-style {
    transform: translateY(34px);

    .s-icon {
      width: 25px;
      height: 15px;
      display: block;
      color: #9ba9c4;
      margin-right: 12px;
    }

    .item-wrap {
      display: flex;
      transform: translate(20px);
      width: 100%;
      align-items: center;
    }
  }
}
</style>
