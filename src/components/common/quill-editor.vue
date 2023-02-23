<template>
  <div>
    <vue-editor
      id="editor"
      ref="editor"
      v-model="note"
      :placeholder="placeholder"
      @blur="handleChange"
      @focus="handleChange"
      @text-change="handleChange"
      :editorToolbar="quillToolbar"
    ></vue-editor>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  name: 'quill-vue',
  props: {
    name: { type: String },
    value: { type: String },
    placeholder: { type: String },
    withFiles: { type: Boolean, default: true }
  },
  components: {
    VueEditor
  },
  data () {
    return {
      note: '',
      quillToolbar: [
        ['bold', 'italic', 'underline'],
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', { list: 'ordered' }, { list: 'bullet' }],
        [
          { color: [] },
          { background: [] }
        ],
        ['link']
      ]
    }
  },
  created () {
    this.note = this.value
  },
  methods: {
    handleChange (delta, old, source) {
      this.$emit('change', this.note)
    }
  }
}
</script>

<style>

</style>
