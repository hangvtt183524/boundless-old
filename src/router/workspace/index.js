import AutomationRoutes from './automation'
import SettingsRoutes from './settings'
import DashboardRoutes from './dashboards'
import LogsRoutes from './logs'
import AccessRoutes from './access'
import DeploymentRoutes from './deployment'

const UserList = () => import(/* webpackChunkName: "org-user" */ '@/components/user/list')
const UserDetail = () => import(/* webpackChunkName: "org-user" */ '@/components/user/detail')
const UserInvitation = () => import(/* webpackChunkName: "org-user" */ '@/components/user/invitation-page')
const RoleList = () => import(/* webpackChunkName: "org-user" */ '@/components/permissions/list')
const RoleDetail = () => import(/* webpackChunkName: "org-user" */ '@/components/permissions/detail')
const ExternalApiKeyList = () => import(/* webpackChunkName: "org-user" */ '@/components/workspace/external-api-keys/list')
const ExternalApiKeySetup = () => import(/* webpackChunkName: "org-user" */ '@/components/workspace/external-api-keys/setup')
const ActivityLogPage = () => import(/* webpackChunkName: "org-activity" */ '@/components/activity-log/activity-log-page')

export default [
  ...AutomationRoutes,
  ...SettingsRoutes,
  ...DashboardRoutes,
  ...LogsRoutes,
  ...AccessRoutes,
  ...DeploymentRoutes,
  {
    path: 'users',
    name: 'Users',
    component: UserList,
    props: {
      mode: 'workspace'
    },
    meta: {
      roles: ['internal', 'admin'],
      title: 'Users',
      descriptiveName: 'User Listing'
    }
  },
  {
    path: 'users/invitation',
    name: 'UserInvitation',
    component: UserInvitation,
    props: {
      mode: 'workspace'
    },
    meta: {
      roles: ['internal', 'admin'],
      title: 'User Invitation',
      descriptiveName: 'User Invitation'
    }
  },
  {
    path: 'users/:userId',
    name: 'UserDetail',
    component: UserDetail,
    props: (route) => ({
      mode: 'workspace',
      userId: route.params.userId
    }),
    meta: {
      roles: ['internal', 'admin'],
      title: 'User Detail',
      descriptiveName: 'User Detail'
    }
  },
  {
    path: 'roles',
    name: 'Roles',
    component: RoleList,
    props: {
      mode: 'workspace'
    },
    meta: {
      title: 'Roles',
      descriptiveName: 'Role Listing'
    }
  },
  {
    path: 'roles/new',
    name: 'NewRole',
    component: RoleDetail,
    props: {
      mode: 'workspace'
    },
    meta: {
      title: 'Create Role',
      descriptiveName: 'Role Create'
    }
  },
  {
    path: 'roles/:roleId',
    name: 'RoleDetail',
    component: RoleDetail,
    props: (route) => ({
      mode: 'workspace',
      roleId: route.params.roleId
    }),
    meta: {
      title: 'Update Role',
      descriptiveName: 'Role Detail'
    }
  },
  {
    path: 'api-keys',
    name: 'ExternalApiKeys',
    component: ExternalApiKeyList,
    meta: {
      title: 'API Keys',
      descriptiveName: 'API Key Listing'
    }
  },
  {
    path: ':productName/api-keys/setup',
    name: 'ExternalApiKeysSetup',
    component: ExternalApiKeySetup,
    props: true,
    meta: {
      title: 'Add API Key',
      descriptiveName: 'API Key Setup'
    }
  },
  {
    path: 'activity-log',
    name: 'ActivityLog',
    component: ActivityLogPage,
    meta: {
      title: 'Activity Log',
      descriptiveName: 'Audit Log'
    }
  }
]
