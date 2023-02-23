import { mapGetters } from 'vuex'

let OrgPermissionsMixin = {
  computed: {
    ...mapGetters('organization', ['selectedOrgPermissions']),
    hasAdminPermission () {
      return this.selectedOrgPermissions.includes('admin')
    },
    hasManagePermission () {
      return this.selectedOrgPermissions.includes('manage')
    },
    canManageOrg () {
      return this.hasAdminPermission || this.hasManagePermission
    }
  }
}

export default OrgPermissionsMixin
