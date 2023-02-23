<template lang="pug">
#doc-content
  #loading-spinner
    v-progress-circular(:size="50" indeterminate color="primary")
  iframe#doc-frame(
    :src="doc.id"
    onload="document.getElementById('loading-spinner').style.display='none'"
  )
  bottombar
</template>

<script>
import bottombar from './bottombar'

export default {
  name: 'doc-content',
  props: {
    doc: {}
  },
  data () {
    return {
      loading: false
    }
  },
  components: {
    bottombar
  },
  watch: {
    doc: function (val) {
      document.getElementById('loading-spinner').style.display = 'flex'
    }
  }
}
</script>

<style lang="scss">
#doc-content {
  #doc-frame {
    width: 100%;
    height: calc(100vh - 66px);
    border: 0;
    margin-top: -38px;
  }
  #loading-spinner {
    position: absolute;
    display: flex;
    height: calc(100vh - 40px - 64px);
    width: calc(100vw - 240px);
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
  }
}
</style>
