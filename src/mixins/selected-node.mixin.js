import { mapActions, mapGetters } from 'vuex'

const SelectedNodeMixin = {
  computed: {
    ...mapGetters('layout', ['selectedNode']),
    wifiConfig () {
      return this.selectedNode.wifi_config || {}
    }
  },
  methods: {
    ...mapActions('organization/node', ['updateNode'])
  }
}

export default SelectedNodeMixin
