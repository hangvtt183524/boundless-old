import VenueRoutes from './venues'
import MonitoringRoutes from './monitoring'
import MarketingRoutes from './marketing'
import SettingsRoutes from './settings'
import WifiSettingsRoutes from './wifi'
import SecurityRoutes from './security'

const Inventory = () => import(/* webpackChunkName: "org-devices" */ '@/components/inventory/list')
const OrganizationHome = () => import(/* webpackChunkName: "main" */ '@/components/pages/organization/Home')
const HardwareSetup = () => import(/* webpackChunkName: "profile" */ '@/components/organization/setup/wifi-setup-page/wifi-setup-page')

export default [
  ...VenueRoutes,
  ...MonitoringRoutes,
  ...MarketingRoutes,
  ...SettingsRoutes,
  ...WifiSettingsRoutes,
  ...SecurityRoutes,
  {
    path: '/',
    name: 'OrganizationHome',
    component: OrganizationHome,
    meta: {
      nodeRoles: ['organization']
    }
  },
  {
    path: 'inventory',
    name: 'OrganizationInventory',
    component: Inventory,
    meta: {
      roles: ['internal', 'admin'],
      nodeRoles: ['organization'],
      title: 'Device Inventory',
      descriptiveName: 'Device Listing'
    }
  },
  {
    path: 'setup-wifi-network',
    name: 'OrganizationSetupWifiNetwork',
    component: HardwareSetup,
    props: (route) => ({
      isQuickSetup: true
    }),
    meta: {
      roles: ['internal', 'admin'],
      nodeRoles: ['organization'],
      title: 'Organization Setup',
      descriptiveName: 'Hardware Setup'
    }
  },
  {
    path: 'hardware-setup',
    name: 'HardwareSetup',
    component: HardwareSetup,
    props: (route) => ({
      isQuickSetup: false
    }),
    meta: {
      roles: ['internal', 'admin'],
      nodeRoles: ['organization'],
      title: 'Hardware Setup'
    }
  }
]
