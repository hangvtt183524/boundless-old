import { mapGetters } from 'vuex'

let CurrentNodeSelectionsMixin = {

  computed: {
    ...mapGetters('layout', ['selectedWorkspace', 'selectedOrganization', 'selectedNode']),
    organizationId () {
      return (this.selectedOrganization ? this.selectedOrganization.id : null) ||
        (this.$route.params.orgId ? parseInt(this.$route.params.orgId) : null)
    },
    nodeId () {
      return (this.selectedNode ? this.selectedNode.id : null) ||
        (this.$route.params.nodeId ? parseInt(this.$route.params.nodeId) : null)
    },
    workspaceId () {
      return (this.selectedWorkspace ? this.selectedWorkspace.id : null) ||
        (this.$route.params.workspaceId ? parseInt(this.$route.params.workspaceId) : null)
    },
    routeNodeParameters () {
      return {
        orgId: this.organizationId,
        nodeId: this.nodeId,
        workspaceId: this.workspaceId
      }
    }
  }
}

export default CurrentNodeSelectionsMixin
