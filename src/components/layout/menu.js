export default [
  {
    'icon': 'pie_chart',
    'identifier': 'access',
    'image': 'menu-access.png',
    'class': 'access',
    'prefix': 'access_',
    'description': 'Role-Based Access Control, and batch user management for your Meraki organizations.',
    'translation': 'access',
    'default_page': 'AccessApplicationList',
    'product_permission_sets': [
      ['access_control__view_applications'],
      ['access_control__configure_organization_saml']
    ],
    'subgroups': [
      {
        'name': 'organizations',
        'icon': 'portal_administration',
        'leaf': true
      },
      {
        'name': 'role based access',
        'icon': 'portal_setup',
        'always_open': true,
        'permission_sets': [
          ['access_control__assign_vendor_roles'],
          ['access_control__view_vendor_role'],
          ['access_control__create_vendor_role'],
          ['access_control__edit_vendor_role'],
          ['access_control__delete_vendor_role']
        ]
      },
      {
        'name': 'user management',
        'icon': 'portal_organization',
        'always_open': true,
        'permission_sets': [
          ['access_control__manage_external_user_permissions']
        ]
      }
    ],
    'submenu': [
      {
        'subgroup': 'organizations',
        'route': 'AccessApplicationList',
        'permission_sets': [
          ['access_control__view_applications'],
          ['access_control__configure_organization_saml']
        ]
      },
      {
        'subgroup': 'role based access',
        'translation': 'access_control_lists',
        'route': 'AccessUserVendorRoleList',
        'permission_sets': [
          ['access_control__assign_vendor_roles']
        ]
      },
      {
        'subgroup': 'role based access',
        'translation': 'permission_roles',
        'route': 'AccessVendorRoleList',
        'permission_sets': [
          ['access_control__view_vendor_role'],
          ['access_control__create_vendor_role'],
          ['access_control__edit_vendor_role'],
          ['access_control__delete_vendor_role']
        ]
      },
      {
        'subgroup': 'role based access',
        'translation': 'saml_users',
        'route': 'AccessSAMLUserList',
        'permission_sets': [
          ['access_control__assign_vendor_roles']
        ]
      },
      {
        'subgroup': 'user management',
        'translation': 'organization_admins',
        'route': 'UserManagementList',
        'permission_sets': [
          ['access_control__manage_external_user_permissions']
        ]
      }
      /*
      {
        'subgroup': 'user management',
        'translation': 'meraki_auth'
      }
      */
    ]
  },
  {
    'icon': 'business_center',
    'identifier': 'network_management',
    'translation': 'network_management',
    'class': 'network-management',
    'prefix': 'network_',
    'description': 'Batch configuration changes, auditing, and monitoring across your organization',
    'image': 'menu-captive-portal.png',
    'default_page': 'OrganizationList',
    'product_permission_sets': [
      ['network_templates__manage']
    ],
    'subgroups': [
      {
        'name': 'organizations',
        'icon': 'network_setup',
        'leaf': true
      },
      {
        'name': 'configuration',
        'icon': 'network_configuration',
        'leaf': true
      },
      {
        'name': 'audit & compliance',
        'icon': 'network_audit_compliance',
        'leaf': true
      },
      {
        'name': 'monitoring',
        'icon': 'network_monitoring',
        'leaf': true
      }
      /*
      {
        'name': 'custom dashboards',
        'icon': 'network_deployment',
        'leaf': true
      },
      {
        'name': 'dashboards',
        'icon': 'network_configuration',
        'always_open': true,
        'conditions': ['hasDashboards']
      }
      */
    ],
    'submenu': [
      {
        'subgroup': 'organizations',
        'route': 'OrganizationList',
        'permission_sets': [
          ['network_templates__manage']
        ]
      },
      {
        'translation': 'configurations',
        'subgroup': 'configuration',
        'route': 'TemplateList',
        'permission_sets': [
          ['network_templates__manage']
        ]
      },
      {
        'translation': 'monitoring',
        'subgroup': 'monitoring',
        'tabs': [
          {
            'translation': 'clients',
            'route': 'WifiClients',
            'permission_sets': [
              ['network_client_monitoring__view']
            ]
          },
          {
            'translation': 'devices',
            'route': 'MerakiDevices',
            'permission_sets': [
              ['network_device_monitoring__view']
            ]
          },
          {
            'translation': 'networks',
            'route': 'MerakiNetworks',
            'permission_sets': [
              ['network_monitoring__view']
            ]
          },
          {
            'translation': 'switch_ports',
            'route': 'MerakiSwitchPorts',
            'permission_sets': [
              ['network_device_monitoring__view']
            ],
            'conditions': [
              {
                'method': 'restrictedToWorkspaces',
                'arguments': [[58256]], // LVMH
                'environments': ['production']
              }
            ]
          }
        ]
      },
      {
        'translation': 'audit_and_compliance',
        'subgroup': 'audit & compliance',
        'tabs': [
          {
            'translation': 'security',
            'route': 'SecurityCompliance',
            'permission_sets': [
              ['network_security__manage']
            ]
          },
          {
            'translation': 'tags',
            'route': 'Tags',
            'permission_sets': [
              ['network_tags__manage']
            ]
          },
          {
            'translation': 'names',
            'route': 'NameCompliance',
            'permission_sets': [
              ['network_names__manage']
            ]
          },
          {
            'translation': 'configuration',
            'route': 'ConfigurationCompliance',
            'permission_sets': [
              ['network_configurations__manage']
            ]
          }
        ]
      }
      /*
      {
        'translation': 'custom_dashboards',
        'subgroup': 'custom dashboards',
        'route': 'DashboardList',
        'permission_scope': 'organization',
        'permission_sets': [
          ['dashboards__view'],
          ['dashboards__create']
        ]
      }
      */
    ]
  },
  {
    'icon': 'wifi',
    'identifier': 'captive_portal',
    'image': 'menu-wifi.png',
    'class': 'captive-portal',
    'prefix': 'portal_',
    'description': 'Easily configure, secure and manage Guest Wi-Fi access in multiple sites.',
    'translation': 'captive_portal',
    'default_page': 'WifiAnalytics',
    'product_permission_sets': [
      ['captive_portal_analytics__view']
    ],
    'subgroups': [
      {
        'name': 'setup',
        'icon': 'portal_setup',
        'always_open': true
      },
      {
        'name': 'create',
        'icon': 'portal_create',
        'always_open': true
      },
      {
        'name': 'view',
        'icon': 'portal_view',
        'always_open': true
      }
    ],
    'submenu': [
      {
        'translation': 'meraki_api',
        'subgroup': 'setup',
        'conditions': ['isMerakiSetup'],
        'route': 'OrganizationSettingsMeraki',
        'permission_scope': 'organization',
        'permission_sets': [
          ['organizations__edit', 'organizations__configure_meraki']
        ]
      },
      {
        'translation': 'hardware_setup',
        'route': 'HardwareSetup',
        'subgroup': 'setup',
        'conditions': ['isMerakiSetup'],
        'permission_scope': 'organization',
        'permission_sets': [
          ['wifi_deployment__deploy']
        ]
      },
      {
        'translation': 'venues',
        'route': 'Venues',
        'subgroup': 'setup',
        'permission_scope': 'organization',
        'permission_sets': [
          ['venues__create'],
          ['venues__edit'],
          ['venues__delete']
        ]
      },
      {
        'translation': 'device_inventory',
        'route': 'OrganizationInventory',
        'subgroup': 'setup',
        'permission_scope': 'organization',
        'permission_sets': [
          ['devices__import'],
          ['devices__list']
        ]
      },
      {
        'translation': 'authentication_settings',
        'subgroup': 'setup',
        'tabs': [
          {
            'translation': 'self_registration',
            'route': 'SelfRegistration',
            'permission_scope': 'node',
            'permission_sets': [
              ['wifi_settings__edit']
            ]
          },
          {
            'translation': 'sponsored_access',
            'route': 'SponsoredAccess',
            'permission_scope': 'node',
            'permission_sets': [
              ['sponsored_access__list'],
              ['sponsored_access__edit_settings']
            ]
          },
          {
            'translation': 'ticketing',
            'route': 'Ticketing',
            'permission_scope': 'node',
            'permission_sets': [
              ['ticketing__list'],
              ['ticketing__create']
            ]
          },
          {
            'translation': 'access_codes',
            'route': 'AccessCodes',
            'permission_scope': 'node',
            'permission_sets': [
              ['wifi_access_codes__list'],
              ['wifi_access_codes__create']
            ]
          },
          {
            'translation': 'ldap_authentication',
            'route': 'LdapAuthentication',
            'permission_scope': 'node',
            'permission_sets': [
              ['ldap_settings__edit']
            ]
          },
          {
            'translation': 'single_sign_on',
            'route': 'SSOAuthentication',
            'permission_scope': 'node',
            'permission_sets': [
              ['saml_settings__edit']
            ]
          }
        ]
      },
      {
        'translation': 'splash_pages',
        'subgroup': 'create',
        'tabs': [
          {
            'translation': 'splash_templates',
            'route': 'SplashPages',
            'permission_scope': 'organization',
            'permission_sets': [
              ['templates__view'],
              ['templates__create']
            ]
          },
          {
            'translation': 'campaigns',
            'route': 'Campaigns',
            'permission_scope': 'organization',
            'permission_sets': [
              ['campaigns__list'],
              ['campaigns__edit']
            ]
          }
        ]
      },
      {
        'translation': 'media_library',
        'subgroup': 'create',
        'route': 'MediaLibrary',
        'permission_scope': 'organization',
        'permission_sets': [
          ['media_library__view'],
          ['media_library__create']
        ]
      },
      {
        'translation': 'connected_visitor_listing',
        'subgroup': 'view',
        'route': 'Visitors',
        'permission_sets': [
          ['connected_visitors__view_marketing_data'],
          ['connected_visitors__view_technical_data']
        ]
      },
      {
        'translation': 'captive_portal_analytics',
        'subgroup': 'view',
        'route': 'WifiAnalytics',
        'permission_sets': [
          ['captive_portal_analytics__view']
        ]
      }
    ]
  }
]
