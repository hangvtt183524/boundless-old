const GeneralSettings = () => import(/* webpackChunkName: "org-settings" */ '@/components/settings/workspace/general-settings')
const SingleSignOnSettings = () => import(/* webpackChunkName: "org-settings" */ '@/components/settings/single-sign-on-settings')

export default [
  {
    path: 'settings/general',
    name: 'SettingsGeneral',
    component: GeneralSettings,
    meta: {
      title: 'General Settings',
      descriptiveName: ' Settings'
    }
  },
  {
    path: 'settings/branding',
    name: 'SettingsBranding',
    component: GeneralSettings,
    meta: {
      title: 'Branding'
    }
  },
  {
    path: 'settings/security',
    name: 'SettingsSecurity',
    component: GeneralSettings,
    meta: {
      title: 'Security Settings'
    }
  },
  {
    path: 'settings/single-sign-on',
    name: 'SettingsSingleSignOn',
    component: SingleSignOnSettings,
    meta: {
      title: 'Single Sign On',
      descriptiveName: ' SSO Settings'
    }
  }
]
