const DashboardList = () => import(/* webpackChunkName: "org-create" */ '@/components/dashboard/list')
const DashboardDetail = () => import(/* webpackChunkName: "org-create" */ '@/components/dashboard/detail')
const UserDashboard = () => import(/* webpackChunkName: "org-create" */ '@/components/dashboard/user-dashboard')

export default [
  {
    path: 'dashboards',
    name: 'DashboardList',
    component: DashboardList,
    meta: {
      descriptiveName: 'Custom Dashboards Listing'
    }
  },
  {
    path: 'dashboards/new',
    name: 'NewDashboard',
    component: DashboardDetail,
    meta: {
      title: 'Create Dashboard',
      descriptiveName: 'Custom Dashboards Detail'
    }
  },
  {
    path: 'dashboards/:dashboardId',
    name: 'DashboardDetail',
    component: DashboardDetail,
    props: (route) => ({
      dashboardId: route.params.dashboardId
    }),
    meta: {
      title: 'Update Dashboard',
      descriptiveName: 'Custom Dashboards Detail'
    }
  },
  {
    path: 'user-dashboard/:dashboardId',
    name: 'UserDashboard',
    component: UserDashboard,
    props: (route) => ({
      dashboardId: route.params.dashboardId
    }),
    meta: {
      title: 'Dashboard'
    }
  }
]
