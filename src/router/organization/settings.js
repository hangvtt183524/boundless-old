
const CaptivePortalSettings = () => import(/* webpackChunkName: "org-settings" */ '@/components/settings/organization/captive-portal-settings')
const ExternalIntegrations = () => import(/* webpackChunkName: "org-settings" */ '@/components/settings/organization/external-integrations')
const MerakiSettings = () => import(/* webpackChunkName: "org-settings" */ '@/components/settings/organization/meraki-integration/meraki-setting-detail')

export default [
  {
    path: 'settings/branding',
    name: 'OrganizationSettingsBranding',
    component: CaptivePortalSettings,
    meta: {
      title: 'Branding',
      descriptiveName: 'Portal Settings'
    }
  },
  {
    path: 'settings/communication-providers',
    name: 'OrganizationSettingsCommunicationProviders',
    component: CaptivePortalSettings,
    meta: {
      title: 'Communication Providers',
      descriptiveName: 'Portal Settings'
    }
  },
  {
    path: 'settings/social-login',
    name: 'OrganizationSettingsSocialLogin',
    component: CaptivePortalSettings,
    meta: {
      title: 'Social Login'
    }
  },
  {
    path: 'settings/mist',
    name: 'OrganizationSettingsMist',
    component: CaptivePortalSettings,
    meta: {
      title: 'Mist'
    }
  },
  {
    path: 'settings/external-integrations',
    name: 'OrganizationSettingsExternalIntegrations',
    component: ExternalIntegrations,
    meta: {
      title: 'External Integrations'
    }
  },
  {
    path: 'settings/external-integrations/meraki',
    name: 'OrganizationSettingsMeraki',
    component: MerakiSettings,
    meta: {
      title: 'Meraki Settings',
      descriptiveName: 'Meraki Setup'
    }
  }
]
