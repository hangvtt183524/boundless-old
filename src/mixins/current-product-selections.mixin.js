import { mapGetters } from 'vuex'

let CurrentProductSelectionsMixin = {

  data: function () {
    return {
      organizationProducts: ['captive_portal'],
      captivePortalProductIdentifier: 'captive_portal',
      networkManagementProductIdentifier: 'network_management'
    }
  },

  computed: {
    ...mapGetters('layout', ['menu', 'activeProductIndex']),

    activeProduct () {
      return (Number.isInteger(this.activeProductIndex) && this.menu.length > this.activeProductIndex)
        ? this.menu[this.activeProductIndex] : null
    },
    activeProductIdentifier () {
      return this.activeProduct ? this.activeProduct.identifier : null
    },
    isOnOrganizationProduct () {
      return this.organizationProducts.indexOf(this.activeProductIdentifier) > -1
    }
  }
}

export default CurrentProductSelectionsMixin
