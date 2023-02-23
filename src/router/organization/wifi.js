const WifiConfigurationTicket = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/configuration/ticket')
const WifiConfigurationMultipleAccess = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/configuration/multiple-access')
const WifiConfigurationSponsors = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/configuration/sponsors')

const WifiSettingsParameters = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/paramenters/index')
const WifiSettingsParametersGuest = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/paramenters/guest')
const WifiSettingsParametersSecured = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/paramenters/secured')

const WifiSelfRegistration = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/self-registration')
const WifiSponsoredAccess = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/sponsored-access')
const WifiTicketing = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/ticketing')
const WifiAccessCodes = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/access-codes')
const WifiVoucherCodes = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/wifi-codes/view-codes')
const WifiLdapAuthentication = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/ldap-authentication')
const WifiSSOAuthentication = () => import(/* webpackChunkName: "wifi" */ '@/components/wifi-settings/sso-authentication')

export default [
  {
    path: 'wifi/authorization-parameters',
    redirect: 'wifi/authorization-parameters/guest',
    name: 'WifiSettingsParameters',
    component: WifiSettingsParameters,
    children: [
      {
        path: 'guest',
        name: 'WifiSettingsParametersGuest',
        component: WifiSettingsParametersGuest,
        meta: {
          nodeRoles: ['organization', 'group', 'site'],
          title: 'Guest'
        }
      },
      {
        path: 'secured',
        name: 'WifiSettingsParametersSecured',
        component: WifiSettingsParametersSecured,
        meta: {
          nodeRoles: ['organization', 'group', 'site']
        }
      }
    ]
  },
  {
    path: 'wifi/self-registration',
    name: 'SelfRegistration',
    component: WifiSelfRegistration,
    meta: {
      roles: ['internal', 'admin', 'manage'],
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Wifi Config',
      descriptiveName: 'Session Limits'
    }
  },
  {
    path: 'wifi/sponsored-access',
    name: 'SponsoredAccess',
    component: WifiSponsoredAccess,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Sponsor Access',
      descriptiveName: 'Sponsored Visitor Listing'
    }
  },
  {
    path: 'wifi/sponsored-access/sponsor',
    name: 'AddSponsors',
    component: WifiConfigurationSponsors,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Access Codes',
      descriptiveName: 'Sponsor Management'
    }
  },
  {
    path: 'wifi/ticketing',
    name: 'Ticketing',
    component: WifiTicketing,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Ticketing',
      descriptiveName: 'Ticket Listing'
    }
  },
  {
    path: 'wifi/ticketing/access-ticket',
    name: 'AddTicket',
    component: WifiConfigurationTicket,
    meta: {
      nodeRoles: ['organization', 'group', 'site']
    }
  },
  {
    path: 'wifi/access-codes',
    name: 'AccessCodes',
    component: WifiAccessCodes,
    meta: {
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Vouchers',
      descriptiveName: 'Access Code Listing'
    }
  },
  {
    path: 'wifi/access-codes/:voucherId',
    name: 'VoucherCodes',
    component: WifiVoucherCodes,
    props: true,
    meta: {
      title: 'Voucher Codes'
    }
  },
  {
    path: 'wifi/access-codes/multiple-access',
    name: 'GenerateCodes',
    component: WifiConfigurationMultipleAccess,
    meta: {
      nodeRoles: ['organization', 'group', 'site']
    }
  },
  {
    path: 'wifi/ldap-authentication',
    name: 'LdapAuthentication',
    component: WifiLdapAuthentication,
    meta: {
      roles: ['internal', 'admin', 'manage'],
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Ldap Authentication Config',
      descriptiveName: 'LDAP Authentication Configuration'
    }
  },
  {
    path: 'wifi/single-sign-on',
    name: 'SSOAuthentication',
    component: WifiSSOAuthentication,
    meta: {
      roles: ['internal', 'admin', 'manage'],
      nodeRoles: ['organization', 'group', 'site'],
      title: 'Single Sign On Config',
      descriptiveName: 'SSO Authentication Configuration'
    }
  }
]
