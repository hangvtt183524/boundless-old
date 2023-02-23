
const WifiAnalytics = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/wifi-analytics/index')
const PresenceAnalytics = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/presence-analytics/index')
const Visitors = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/connected-visitors/index')
const VisitorDetails = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/connected-visitors/visitor-details')
const MVSense = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/camera/index')

export default [
  {
    path: 'monitoring/wifi-analytics',
    name: 'WifiAnalytics',
    component: WifiAnalytics,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Wifi Analytics',
      descriptiveName: 'Portal Analytics'
    },
    children: [
      {
        path: ':time/:group',
        name: 'WifiAnalyticsSearch',
        component: WifiAnalytics
      }
    ]
  },
  {
    path: 'monitoring/presence-analytics',
    name: 'PresenceAnalytics',
    component: PresenceAnalytics,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Presence Analytics'
    },
    children: [
      {
        path: ':time/:group',
        name: 'PresenceAnalyticsSearch',
        component: PresenceAnalytics
      }
    ]
  },
  {
    path: 'monitoring/connected-visitors',
    name: 'Visitors',
    component: Visitors,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Connected Visitors',
      descriptiveName: 'Visitor Listing'
    }
  },
  {
    path: 'monitoring/connected-visitors/:visitorId',
    name: 'VisitorDetails',
    component: VisitorDetails,
    props: true,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Visitor Detail',
      descriptiveName: 'Visitor Detail'
    }
  },
  {
    path: 'monitoring/mv-sense',
    name: 'MVSense',
    component: MVSense,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'MV Sense'
    }
  }
]
