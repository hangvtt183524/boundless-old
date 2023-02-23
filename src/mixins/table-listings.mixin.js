import { mapActions, mapGetters } from 'vuex'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'

const ListingMixin = {
  mixins: [
    NodeSelectionsMixin
  ],
  computed: {
    ...mapGetters('layout', ['userOrganizationNodes'])
  },
  methods: {
    ...mapActions('layout', ['selectNode']),
    goToUserDetail (userId) {
      this.$router.push({ name: 'UserDetail', params: { userId } })
    },
    goToSplashPage (splashId) {
      this.$router.push({ name: 'SplashPageBuilder', params: { splashId } })
    },
    goToNodeDetail (nodeId) {
      const node = this.userOrganizationNodes.find(item => item.id === nodeId)
      if (node) {
        this.selectNode(node)
        this.$router.push({ name: 'SiteGroupDetail', params: this.routeNodeParameters })
      }
    },
    goToCampaignDetails (campaignId) {
      this.$router.push({ name: 'CampaignDetail', params: { campaignId } })
    },
    goToDeviceDetails (deviceId) {
      this.$router.push({ name: 'InventoryDetail', params: { deviceId } })
    },
    goToRoleDetails (roleId, role = true) {
      if (!role) return
      if (roleId) {
        this.$router.push({ name: 'EditRole', params: { roleId } })
      } else {
        this.$router.push({ name: 'CreateRole' })
      }
    }
  }
}

export default ListingMixin
