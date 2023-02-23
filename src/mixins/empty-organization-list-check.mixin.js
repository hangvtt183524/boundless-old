import { mapGetters } from 'vuex'

let EmptyOrganizationListCheckMixin = {

  data: function () {
    return {
      emptyOrganizationListCheckProduct: 'network_management',
      emptyOrganizationListCheckNextPage: 'OrganizationImport'
    }
  },

  mounted () {
    if (this.userWorkspaceOrganizationsFetched &&
      this.userWorkspaceOrganizations.filter(
        organization => organization.connected_products.indexOf(this.emptyOrganizationListCheckProduct) > -1
      ).length === 0
    ) {
      // No organizations for required product, redirect to next page
      this.$router.push({ name: this.emptyOrganizationListCheckNextPage })
    }
  },

  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations', 'userWorkspaceOrganizationsFetched'])
  },

  watch: {
    userWorkspaceOrganizationsFetched (newVal, oldVal) {
      if (!oldVal && newVal) {
        // Organizations newly fetched, run the check again
        if (this.userWorkspaceOrganizations.filter(
          organization => organization.connected_products.indexOf(this.emptyOrganizationListCheckProduct) > -1
        ).length === 0) {
          // No organizations for required product, redirect to next page
          this.$router.push({ name: this.emptyOrganizationListCheckNextPage })
        }
      }
    }
  }
}

export default EmptyOrganizationListCheckMixin
