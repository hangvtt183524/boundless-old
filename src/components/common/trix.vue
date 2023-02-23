<template>
  <trix-editor
    ref="theEditor"
    @keydown.stop
    @trix-change="handleChange"
    @trix-initialize="initialize"
    @trix-attachment-add="handleAddFile"
    @trix-attachment-remove="handleRemoveFile"
    @trix-file-accept="handleFileAccept"
    :value="value"
    :placeholder="placeholder"
    class="trix-content"
  />
</template>

<script>
import 'trix/dist/trix.css'
import 'styles/trix.css'

export default {
  name: 'trix-vue',

  props: {
    name: { type: String },
    value: { type: String },
    placeholder: { type: String },
    withFiles: { type: Boolean, default: true }
  },
  created () {
    this.setAttribute()
  },
  methods: {
    initialize () {
      this.$refs.theEditor.editor.insertHTML(this.value)
    },
    setAttribute () {
      Trix.config.textAttributes.sup = { // eslint-disable-line no-undef
        tagName: 'sup',
        inheritable: true
      }
      Trix.config.textAttributes.sub = { // eslint-disable-line no-undef
        tagName: 'sub',
        inheritable: true
      }
      Trix.config.textAttributes.underline = { // eslint-disable-line no-undef
        style: { 'textDecoration': 'underline' },
        inheritable: true,
        parser: element => {
          const style = window.getComputedStyle(element)
          return style.textDecoration === 'underline'
        }
      }
      addEventListener('trix-initialize', event => {
        let buttonHTML = '<button type="button" style="font-size: 14px; font-weight: bold;" class="trix-button" data-trix-attribute="sup"><sup>SUP</sup></button>'
        buttonHTML += '<button type="button" style="font-size: 14px; font-weight: bold;" class="trix-button" data-trix-attribute="sub"><sub>SUB</sub></button>'
        buttonHTML += '<button type="button" style="font-size: 14px; font-weight: bold; text-decoration: underline;" class="underline trix-button" data-trix-attribute="underline" title="underline">U</button>'
        buttonHTML += '<button type="button" style="font-size: 14px;" class="trix-button trix-button--icon trix-button--icon-textAlignLeft" data-trix-attribute="textAlignLeft" title="textAlignLeft">Left</button>'
        buttonHTML += '<button type="button" style="font-size: 14px;" class="trix-button trix-button--icon trix-button--icon-textAlignCenter" data-trix-attribute="textAlignCenter" title="textAlignCenter">Center</button>'
        buttonHTML += '<button type="button" style="font-size: 14px;" class="trix-button trix-button--icon trix-button--icon-textAlignRight" data-trix-attribute="textAlignRight" title="textAlignRight">Right</button>'
        let buttonGroup = event.target.toolbarElement.querySelector('.trix-button-group.trix-button-group--text-tools')
        buttonGroup.insertAdjacentHTML('beforeend', buttonHTML)
      })
    },

    handleChange () {
      this.$emit('change', this.$refs.theEditor.value)
    },

    handleFileAccept (e) {
      if (!this.withFiles) {
        e.preventDefault()
      }
    },

    handleAddFile (event) {
      this.$emit('file-add', event)
    },

    handleRemoveFile (event) {
      this.$emit('file-remove', event)
    }
  }
}
</script>
