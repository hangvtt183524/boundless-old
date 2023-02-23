<template lang="pug">
#documentation
  v-app
    sidebar(@setDocument="setDocument")
    topbar

    v-content.content
      doc-content(:doc="selectedDoc ? selectedDoc : docList[0]")
</template>

<script>
import topbar from './topbar'
import sidebar from './sidebar'
import docContent from './doc-content'
import DocumentationList from '@/api/documentation-list.js'

export default {
  name: 'documentation',
  data () {
    return {
      selectedDoc: null,
      docList: DocumentationList
    }
  },
  components: {
    topbar,
    sidebar,
    docContent,
    DocumentationList
  },
  methods: {
    setDocument (doc) {
      this.selectedDoc = doc
    }
  }
}
</script>

<style lang="scss">
</style>
