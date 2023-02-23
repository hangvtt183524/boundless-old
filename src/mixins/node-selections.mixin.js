// This mixin is responsible for setting active Organization
// and redirecting to the correct url based on the selected Organization.
import _ from 'lodash'
import Ls from '@/services/ls'
import { mapActions, mapGetters } from 'vuex'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import CurrentProductSelectionsMixin from '@/mixins/current-product-selections.mixin'
import ProductOrganizationsMixin from '@/mixins/product-organizations.mixin'

let NodeSelectionsMixin = {

  mixins: [
    CurrentNodeSelectionsMixin,
    CurrentProductSelectionsMixin,
    ProductOrganizationsMixin
  ],

  data () {
    return {
      rootNodeTypes: {
        workspace: 'workspace',
        organization: 'organization'
      },
      layouts: {
        workspace: 'LayoutWorkspace',
        organization: 'LayoutOrganization',
        home: 'Home',
        login: 'LayoutLogin',
        oauthLogin: 'LoginAuthToken',
        main: 'LayoutMain',
        inviteSignup: 'InviteSignup',
        oauthSignup: 'OauthSignup',
        register: 'Register'
      }
    }
  },

  computed: {
    ...mapGetters('layout', ['userWorkspaces', 'userWorkspaceOrganizations', 'userOrganizationNodes', 'toolbarMenu',
      'hasWorkspaces', 'hasOrganizations'])
  },
  methods: {
    ...mapActions('layout', ['fetchUserWorkspaces', 'fetchUserWorkspaceOrganizations', 'fetchUserOrganizationNodes',
      'selectWorkspace', 'selectOrganization', 'selectNode', 'clearWorkspaceSelections', 'clearOrganizationSelections']),

    getRouteParams () {
      // Return node selection values as route parameters
      return {
        workspaceId: this.selectedWorkspace ? this.selectedWorkspace.id : null,
        orgId: this.selectedOrganization ? this.selectedOrganization.id : null,
        nodeId: this.selectedNode ? this.selectedNode.id : null
      }
    },

    getRouteLayouts () {
      // Returns current route's top 2 layouts
      const layoutData = {}

      if (this.$route.matched.length > 0) {
        layoutData.first = this.$route.matched[0].components.default.name
      }

      if (this.$route.matched.length > 1) {
        layoutData.second = this.$route.matched[1].components.default.name
      }

      return layoutData
    },

    getMenuItemRoute (menuItem) {
      return menuItem.route
    },

    getProductsForRoute (route) {
      const products = []

      for (let index = 0; index < this.menu.length; index++) {
        const product = this.menu[index]

        for (let menuIndex = 0; menuIndex < product.submenu.length; menuIndex++) {
          const subMenuItem = product.submenu[menuIndex]

          if ((this.getMenuItemRoute(subMenuItem) === this.$route.name) &&
            (!subMenuItem.route_parameters || _.some([this.$route.params], subMenuItem.route_parameters))) {
            products.push(index)

            // Continue with next product
            break
          }

          // Current route matches one of menu item's tags
          if ((subMenuItem.tabs && subMenuItem.tabs.map(tab => this.getMenuItemRoute(tab)).indexOf(this.$route.name) > -1)) {
            products.push(index)

            // Continue with next product
            break
          }
        }
      }

      return products
    },

    getUserWorkspaceOrganizationsForProduct (productKey) {
      // Return user workspace organizations that are connected to at least one of the products
      return this.userWorkspaceOrganizations.filter(
        workspaceOrganization => workspaceOrganization.connected_products.indexOf(productKey) > -1
      )
    },

    fetchCurrentOrganizationManagedNodes () {
      return this.fetchUserOrganizationNodes({
        orgId: this.organizationId,
        filters: {
          layout: 'flat',
          types: 'organization,group,site,floor'
        }
      })
    },

    redirectToProductDefaultPage (product) {
      this.$router.push({ name: product.default_page, params: this.getRouteParams() })
    },

    redirectToNode (parentNode, childNodeId) {
      const paramOrgId = this.$route.params.orgId
      const paramNodeId = this.$route.params.nodeId
      const paramWorkspaceId = this.$route.params.workspaceId

      const routeLayouts = this.getRouteLayouts()

      // If target node is the same as currently active node, do not proceed
      if (
        (parentNode.type === this.rootNodeTypes.organization && routeLayouts.second === this.layouts.organization &&
          paramOrgId === parentNode.id && paramNodeId === childNodeId) ||
        (parentNode.type === this.rootNodeTypes.workspace && routeLayouts.second === this.layouts.workspace &&
          paramWorkspaceId === parentNode.id)
      ) {
        return false
      }

      if (parentNode.type === this.rootNodeTypes.workspace && this.isOnOrganizationProduct) {
        // If changing workspace on an organization product, do not proceed with redirection. We will redirect to
        // organization home on organizations load
        return false
      }

      const params = { ...this.$route.params }
      const query = { ...this.$route.query }

      let name = this.$route.name

      // Redirecting to workspace node
      if (parentNode.type === this.rootNodeTypes.workspace) {
        params.workspaceId = Number.parseInt(parentNode.id) || 0

        // Open product home for newly selected workspace
        name = this.activeProduct.default_page
      } else if (parentNode.type === this.rootNodeTypes.organization) {
        params.orgId = Number.parseInt(parentNode.id) || 0
        params.nodeId = Number.parseInt(childNodeId) || 0

        // Open product home for newly selected organization
        name = this.activeProduct.default_page
      }

      this.$router.push({ name: name, params: params, query: query })
    },
    getCaptivePortalOrganizationById (id) {
      /*
        Gets org from the given id
      */
      return this.captivePortalOrganizations.find(org => {
        return org.id === id
      })
    },
    getWorkspaceById (id) {
      /*
        Gets workspace from the given id
      */
      return this.userWorkspaces.find(org => {
        return org.id === id
      })
    },
    selectActiveWorkspace () {
      let workspaceId = Number.parseInt(this.$route.params.workspaceId)

      if (!workspaceId) {
        // No workspace id in request path, try to get org id from local storage
        workspaceId = Number.parseInt(Ls.getJson('layout.state', {}).workspace)
      }

      let workspace = this.getWorkspaceById(workspaceId)
      if (!workspace && this.hasWorkspaces) {
        workspace = this.userWorkspaces[1]
      }

      if (workspace) {
        this.selectWorkspace(workspace)
      } else {
        // No workspaces for user
        this.clearWorkspaceSelections()
        this.loadInitialPage()
        return
      }

      // If current product is not an organization product, directly load initial page
      if (!this.isOnOrganizationProduct) {
        this.loadInitialPage()
      }

      // Load initial selected workspace organizations, then select active organization
      this.fetchUserWorkspaceOrganizations({
        workspaceId: workspace.id
      }).then(() => {
        this.selectActiveOrganization()
      })
    },
    selectActiveOrganization () {
      let orgId = Number.parseInt(this.$route.params.orgId)
      let nodeId = Number.parseInt(this.$route.params.nodeId)

      if (!orgId) {
        // No org id in request path, try to get org id from local storage
        orgId = Number.parseInt(Ls.getJson('layout.state', {}).organization)
      }

      let organization = this.getCaptivePortalOrganizationById(orgId)
      if (!organization) {
        // Organization not found in workspace organizations. If we are on an organization product, organization id
        // takes precedence, so select the organization with provided id. Otherwise select first organization of
        // workspace
        if (orgId && this.isOnOrganizationProduct) {
          organization = { id: orgId }
        } else {
          organization = this.captivePortalOrganizations[0]
        }
      }

      if (organization) {
        if (!nodeId) {
          // If no nodeId in request path, select root organization
          nodeId = organization.id
        }

        this.selectOrganization(organization)
        this.selectNode({ id: nodeId })
      } else {
        // No available organizations for workspace, clear any existing selections
        this.clearOrganizationSelections()
      }

      // If current product is set as an organization product, load initial page after organization selection
      if (this.isOnOrganizationProduct) {
        this.loadInitialPage()
      }
    },
    loadInitialPage () {
      if (!(this.selectedWorkspace && this.selectedWorkspace.id)) {
        // User not connected to any workspaces, redirect to workspace creation page
        this.$router.push({ name: 'CreateWorkspace' })
        return
      }

      if (this.isOnOrganizationProduct && this.userWorkspaceOrganizations.length === 0) {
        // We are on an organization product and we don't have a workspace organization, open organization create page
        this.$router.push({ name: 'CreateOrganizationModeSelect' })
        return
      }

      // Proceed  with opening initial page depending on selected organization
      const routeLayouts = this.getRouteLayouts()
      if (routeLayouts.first === this.layouts.login ||
        routeLayouts.first === this.layouts.oauthLogin ||
        routeLayouts.first === this.layouts.inviteSignup ||
        routeLayouts.first === this.layouts.oauthSignup ||
        routeLayouts.first === this.layouts.register ||
        routeLayouts.second === this.layouts.home
      ) {
        // On a base path, if previous selections are saved in local storage, continue with them
        const layoutState = Ls.getJson('layout.state', {})
        if (!_.isNil(layoutState.activeProductIndex)) {
          this.redirectToProductDefaultPage(this.menu[layoutState.activeProductIndex])
        } else {
          // If previous selection data not present or valid for current user, redirect to workspace home
          this.redirectToNode(this.selectedWorkspace)
        }
      }
    }
  }
}

export default NodeSelectionsMixin
