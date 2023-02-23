<template lang="pug">
  v-layout(row wrap)
    v-flex.mt-4.mb-3(xs12)
      input.form-control.headline(
        type="text",
        v-model="title"
        style="background: #eff3f8;"
      )
    v-flex(xs12)
      //- trix(
      //-   ref='trixEditor'
      //-   name="trixman"
      //-   :value="link.content"
      //-   placeholder=""
      //-   @change="handleContentChange"
      //- )
      QuillEditor(
        @change="handleContentChange"
        :value="link.content"
      )
    v-flex.mt-4.mb-3(xs12)
      v-btn(
        color="primary"
        large
        round
        style="float: right"
        @click="saveHandle"
      ) {{ $t('general.save') }}
      v-btn(
        color="primary"
        large
        outline
        round
        style="float: right"
        @click="cancelHandle"
      ) {{ $t('general.cancel') }}
</template>

<script>
import QuillEditor from '@/components/common/quill-editor'

export default {
  props: {
    selectedItem: {
      type: Object
    },
    link: {
      type: Object
    }
  },
  data () {
    return {
      content: '',
      title: ''
    }
  },
  components: {
    QuillEditor
  },
  mounted () {
    this.setTitle()
  },
  methods: {
    setTitle () {
      this.title = this.link.title
    },
    handleContentChange (val) {
      this.content = val
    },
    saveHandle () {
      this.link.content = this.content
      this.link.title = this.title
      this.$emit('close')
    },
    cancelHandle () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
trix-editor {
  background-color: white !important;
}
</style>
