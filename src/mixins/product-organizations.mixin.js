import { mapGetters } from 'vuex'

let ProductOrganizationsMixin = {

  data: function () {
    return {
      productIdentifiers: {
        captivePortal: 'captive_portal',
        networkManagement: 'network_management',
        accessControl: 'access_control',
        deployment: 'deployment',
        syslog: 'syslog'
      }
    }
  },

  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    captivePortalOrganizations () {
      return this.getUserWorkspaceOrganizationsForProduct(this.productIdentifiers.captivePortal)
    },
    networkManagementOrganizations () {
      return this.getUserWorkspaceOrganizationsForProduct(this.productIdentifiers.networkManagement, true)
    },
    accessControlOrganizations () {
      return this.getUserWorkspaceOrganizationsForProduct(this.productIdentifiers.accessControl, true)
    },
    deploymentOrganizations () {
      return this.getUserWorkspaceOrganizationsForProduct(this.productIdentifiers.deployment, true)
    },
    syslogOrganizations () {
      return this.getUserWorkspaceOrganizationsForProduct(this.productIdentifiers.syslog)
    }
  },

  methods: {
    getUserWorkspaceOrganizationsForProduct (productKey, requireMerakiSetup = false) {
      // Return user workspace organizations that are connected to at least one of the products
      const organizations = requireMerakiSetup
        ? this.userWorkspaceOrganizations.filter(workspaceOrganization => workspaceOrganization.meraki_organization)
        : this.userWorkspaceOrganizations

      return organizations.filter(
        workspaceOrganization => workspaceOrganization.connected_products.indexOf(productKey) > -1
      )
    }
  }
}

export default ProductOrganizationsMixin
