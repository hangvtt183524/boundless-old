const UserList = () => import(/* webpackChunkName: "org-user" */ '@/components/user/list')
const UserDetail = () => import(/* webpackChunkName: "org-user" */ '@/components/user/detail')
const UserInvitation = () => import(/* webpackChunkName: "org-user" */ '@/components/user/invitation-page')
const OrganizationalSummary = () => import(/* webpackChunkName: "admin" */ '@/components/administration/summary/index')
const RoleList = () => import(/* webpackChunkName: "org-user" */ '@/components/permissions/list')
const RoleDetail = () => import(/* webpackChunkName: "org-user" */ '@/components/permissions/detail')
const Devices = () => import(/* webpackChunkName: "org-user" */ '@/components/inventory/global-list')
const WorkspaceList = () => import('@/components/administration/workspace/list')
const WorkspaceDetail = () => import('@/components/administration/workspace/detail')

export default [
  {
    path: 'roles',
    name: 'InternalRoles',
    component: RoleList,
    props: {
      mode: 'internal'
    },
    meta: {
      title: 'Roles',
      descriptiveName: 'Role Listing'
    }
  },
  {
    path: 'roles/new',
    name: 'NewInternalRole',
    component: RoleDetail,
    props: {
      mode: 'internal'
    },
    meta: {
      title: 'Create Role',
      descriptiveName: 'Role Create'
    }
  },
  {
    path: 'roles/:roleId/edit',
    name: 'InternalRoleDetail',
    component: RoleDetail,
    props: (route) => ({
      mode: 'internal',
      roleId: route.params.roleId
    }),
    meta: {
      title: 'Update Role',
      descriptiveName: 'Role Detail'
    }
  },
  {
    path: 'users',
    name: 'InternalUserManagement',
    component: UserList,
    props: {
      mode: 'internal'
    },
    meta: {
      title: 'Internal Users',
      descriptiveName: 'User Listing'
    }
  },
  {
    path: 'users/invitation',
    name: 'InternalUserInvitation',
    component: UserInvitation,
    props: {
      mode: 'internal'
    },
    meta: {
      title: 'User Invitation',
      descriptiveName: 'User Invitation'
    }
  },
  {
    path: 'users/:userId',
    name: 'InternalUserDetail',
    component: UserDetail,
    props: (route) => ({
      mode: 'internal',
      userId: route.params.userId
    }),
    meta: {
      title: 'User Detail',
      descriptiveName: 'User Detail'
    }
  },
  {
    path: 'summary',
    name: 'OrganizationalSummary',
    component: OrganizationalSummary,
    meta: {
      title: 'Summary'
    }
  },
  {
    path: 'devices',
    name: 'Devices',
    component: Devices,
    meta: {
      title: 'Devices'
    }
  },
  {
    path: 'workspaces',
    name: 'Workspaces',
    component: WorkspaceList,
    meta: {
      title: 'Workspaces'
    }
  },
  {
    path: 'workspaces/new',
    name: 'NewWorkspace',
    component: WorkspaceDetail,
    meta: {
      title: 'Create Workspace'
    }
  },
  {
    path: 'workspaces/:workspaceItemId/edit',
    name: 'Detail',
    component: WorkspaceDetail,
    props: (route) => ({
      workspaceItemId: route.params.workspaceItemId
    }),
    meta: {
      title: 'Update Workspace'
    }
  }
]
