import { mapGetters } from 'vuex'

const ManageableNodesMixin = {
  computed: {
    ...mapGetters('organization/node', ['allNodes']),
    ...mapGetters('layout', ['userOrganizationNodes']),
    nodesWithTypeAndIndentation () {
      return this.transformNodesWithTypeAndIndentation(this.userOrganizationNodes)
    }
  },
  methods: {
    transformNodesWithTypeAndIndentation (nodes) {
      return nodes.map(group => {
        return {
          value: group.id,
          text: group.name,
          type: group.type,
          level: group.level
        }
      })
    },
    getNodesByType (types) {
      const nodes = []
      for (let node of this.userOrganizationNodes) {
        if (types.includes(node.type)) {
          nodes.push({
            value: node.id,
            text: node.name,
            type: node.type,
            level: node.level
          })
        }
      }
      return nodes
    },
    getAllNodesByType (types) {
      const nodes = []
      for (let node of this.allNodes) {
        if (types.includes(node.type)) {
          nodes.push({
            value: node.id,
            text: node.name,
            type: node.type,
            level: node.level
          })
        }
      }
      return nodes
    }
  }
}

export default ManageableNodesMixin
