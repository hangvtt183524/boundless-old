<template lang="pug">
  v-avatar(
    :size="size"
    :color="computedColor"
    :tile="tile"
    :class="computedClasses"
    @mouseover="draggingOver = true"
    @mouseleave="draggingOver = false"
    @click="$refs.input.click()"
    @drag.stop.prevent=""
    @dragover.stop.prevent=""
    @dragstart.stop.prevent=""
    @dragend.stop.prevent=""
    @dragenter.stop.prevent="onDragEnter"
    @dragleave.stop.prevent="onDragLeave"
    @drop.stop.prevent="onFileDrop"
  )
    img(v-if="img", :src="img")
    v-icon(v-else, large) {{ placeholderIcon }}
    input(ref="input", hidden, accept="image/*", type="file", @change="onFileChange($event)")
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    size: {
      type: Number,
      default: 150
    },
    color: {
      type: String,
      default: 'grey lighten-4'
    },
    hoverColor: {
      type: String,
      default: 'grey lighten-2'
    },
    tile: {
      type: Boolean,
      default: false
    },
    img: {
      type: String,
      default: ''
    },
    placeholderIcon: {
      type: String,
      default: 'add_a_photo'
    }
  },
  data () {
    return {
      draggingOver: false
    }
  },
  computed: {
    supportsDragAndDrop () {
      const div = document.createElement('div')
      const supportsDrag = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
      const supportsTouch = !('ontouchstart' in window || navigator.msMaxTouchPoints)
      return supportsDrag && supportsTouch
    },
    computedColor () {
      return this.draggingOver ? this.hoverColor : this.color
    },
    computedClasses () {
      const classObject = {}
      classObject['dragging-over'] = this.draggingOver
      return classObject
    }
  },
  methods: {
    onDragEnter () {
      if (!this.supportsDragAndDrop) {
        return
      }
      this.draggingOver = true
    },
    onDragLeave () {
      if (!this.supportsDragAndDrop) {
        return
      }
      this.draggingOver = false
    },
    onFileDrop (event) {
      this.onDragLeave()
      this.onFileChange(event)
    },
    onFileChange (event) {
      const files = event.target.files || event.dataTransfer.files
      if (!files.length) {
        return
      }
      this.$emit('change', files[0])
    }
  }
}
</script>
