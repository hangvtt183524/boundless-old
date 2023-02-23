const ApplicationList = () => import(/* webpackChunkName: "org-security" */ '@/components/access/applications/list')
const ApplicationConfiguration = () => import(/* webpackChunkName: "org-security" */ '@/components/access/applications/configuration')
const VendorRoleList = () => import(/* webpackChunkName: "org-security" */ '@/components/access/permissions/list')
const VendorRoleDetail = () => import(/* webpackChunkName: "org-user" */ '@/components/access/permissions/detail')
const UserVendorRoleList = () => import(/* webpackChunkName: "org-security" */ '@/components/access/access-control/list')
const UserVendorRoleDetail = () => import(/* webpackChunkName: "org-security" */ '@/components/access/access-control/detail')
const SAMLUserList = () => import(/* webpackChunkName: "org-security" */ '@/components/access/saml-user/list')
const UserManagementList = () => import(/* webpackChunkName: "org-security" */ '@/components/access/user-management/list')
const UserManagementInvitation = () => import(/* webpackChunkName: "org-security" */ '@/components/access/user-management/invitation')
const UserManagementRemoval = () => import(/* webpackChunkName: "org-security" */ '@/components/access/user-management/removal')
const UserManagementUserDetail = () => import(/* webpackChunkName: "org-security" */ '@/components/access/user-management/user-detail')
const UserManagementOrganizationUserDetail = () => import(/* webpackChunkName: "org-security" */ '@/components/access/user-management/organization-user-detail')

export default [
  {
    path: 'access/applications',
    name: 'AccessApplicationList',
    component: ApplicationList,
    meta: {
      descriptiveName: 'Access Application Listing'
    }
  },
  {
    path: 'access/applications/configuration',
    name: 'AccessApplicationConfiguration',
    component: ApplicationConfiguration,
    meta: {
      descriptiveName: 'Access Application Configuration'
    }
  },
  {
    path: 'access/vendor-roles',
    name: 'AccessVendorRoleList',
    component: VendorRoleList,
    meta: {
      descriptiveName: 'Access Vendor Role Listing'
    }
  },
  {
    path: 'access/vendor-roles/new',
    name: 'NewAccessVendorRole',
    component: VendorRoleDetail,
    meta: {
      title: 'Create Vendor Role',
      descriptiveName: 'Vendor Role Create'
    }
  },
  {
    path: 'access/vendor-roles/:vendorRoleId',
    name: 'AccessVendorRoleDetail',
    component: VendorRoleDetail,
    props: (route) => ({
      vendorRoleId: route.params.vendorRoleId
    }),
    meta: {
      title: 'Update Vendor Role',
      descriptiveName: 'Vendor Role Detail'
    }
  },
  {
    path: 'access/access-control',
    name: 'AccessUserVendorRoleList',
    component: UserVendorRoleList,
    meta: {
      descriptiveName: 'Access Control Listing'
    }
  },
  {
    path: 'access/access-control/new',
    name: 'NewAccessUserVendorRole',
    component: UserVendorRoleDetail,
    meta: {
      title: 'Create Access Control',
      descriptiveName: 'Access Control Create'
    }
  },
  {
    path: 'access/access-control/:userVendorRoleId',
    name: 'AccessUserVendorRoleDetail',
    component: UserVendorRoleDetail,
    props: (route) => ({
      userVendorRoleId: route.params.userVendorRoleId
    }),
    meta: {
      title: 'Update Access Control',
      descriptiveName: 'Access Control Detail'
    }
  },
  {
    path: 'access/saml-users',
    name: 'AccessSAMLUserList',
    component: SAMLUserList,
    meta: {
      descriptiveName: 'Access SAML User Listing'
    }
  },
  {
    path: 'access/user-management',
    name: 'UserManagementList',
    component: UserManagementList,
    meta: {
      descriptiveName: 'Access User Management Listing'
    }
  },
  {
    path: 'access/user-management/invitation',
    name: 'UserManagementInvitation',
    component: UserManagementInvitation,
    meta: {
      descriptiveName: 'Access User Management Invitation'
    },
    props: route => ({
      selectedUsers: route.params.selectedUsers
    })
  },
  {
    path: 'access/user-management/removal',
    name: 'UserManagementRemoval',
    component: UserManagementRemoval,
    meta: {
      descriptiveName: 'Access User Management Removal'
    },
    props: route => ({
      selectedUsers: route.params.selectedUsers
    })

  },
  {
    path: 'access/user-management/:merakiUserId',
    name: 'UserManagementUserDetail',
    component: UserManagementUserDetail,
    meta: {
      descriptiveName: 'Access User Detail'
    },
    props: route => ({
      merakiUserId: route.params.merakiUserId
    })
  },
  {
    path: 'access/user-management/organization/:ownerOrganizationId/:merakiOrganizationUserId',
    name: 'UserManagementOrganizationUserDetail',
    component: UserManagementOrganizationUserDetail,
    meta: {
      descriptiveName: 'Access Organization User Detail'
    },
    props: route => ({
      ownerOrganizationId: route.params.ownerOrganizationId,
      merakiOrganizationUserId: route.params.merakiOrganizationUserId
    })
  }
]
