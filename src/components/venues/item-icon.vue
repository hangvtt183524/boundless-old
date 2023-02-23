<template lang="pug">
  span
    briefcase-icon(v-if="type == 'organization'")
    folder-icon-closed(v-else-if="type == 'group' && collapsed")
    folder-icon(v-else-if="type == 'group'")
    wifi-icon(v-else-if="type == 'device'")
    floor-icon(v-else-if="type == 'floor'")
    map-marker-icon(v-else)
</template>

<script>
import briefcaseIcon from '@/components/icons/briefcase'
import folderIcon from '@/components/icons/folder'
import folderIconClosed from '@/components/icons/folder-closed'
import mapMarkerIcon from '@/components/icons/map-marker'
import wifiIcon from '@/components/icons/wifi'
import floorIcon from '@/components/icons/floor'

export default {
  props: {
    type: {
      required: true,
      type: String
    },
    collapsed: {
      type: Boolean,
      Default: false
    }
  },
  components: {
    briefcaseIcon,
    folderIcon,
    mapMarkerIcon,
    folderIconClosed,
    wifiIcon,
    floorIcon
  }
}
</script>

<style>
.s-icon {
  width: 25px;
  height: 25px;
  display: block;
  color: rgb(158, 172, 198);
}
</style>
