export default {
  'subgroups': [
    {
      'name': 'settings',
      'translation': 'settings',
      'image': 'settings_white.svg'
    },
    {
      'name': 'users_and_permissions',
      'translation': 'users_and_permissions',
      'image': 'person2_white.svg'
    },
    {
      'name': 'support',
      'translation': 'support',
      'image': 'support_white.svg'
    },
    {
      'name': 'workspaces',
      'translation': 'workspaces',
      'image': 'documentation_white.svg',
      'conditions': ['hasMultipleWorkspaces']
    },
    {
      'name': 'administration',
      'translation': 'administration',
      'image': 'account_white.svg',
      'conditions': ['isGlobal']
    }
  ],
  'submenu': [
    {
      'translation': 'general',
      'subgroup': 'settings',
      'route': 'SettingsGeneral',
      'alternate_routes': ['SettingsBranding', 'SettingsSecurity'],
      'permission_sets': [
        ['workspaces__edit'],
        ['workspaces__delete'],
        ['workspaces__edit_logo'],
        ['workspaces__configure_security_settings']
      ]
    },
    {
      'translation': 'single_sign_on',
      'subgroup': 'settings',
      'route': 'SettingsSingleSignOn',
      'permission_sets': [
        ['workspaces__configure_sso_settings']
      ]
    },
    {
      'subgroup': 'settings',
      'translation': 'workspaces',
      'route': 'NewWorkspace',
      'permission_sets': [
        ['workspaces__edit'],
        ['workspaces__delete'],
        ['workspaces__edit_logo'],
        ['workspaces__configure_security_settings']
      ]
    },
    {
      'translation': 'user_management',
      'route': 'Users',
      'subgroup': 'users_and_permissions',
      'permission_scope': 'workspace',
      'permission_sets': [
        ['workspace_users__list'],
        ['workspace_users__invite']
      ]
    },
    {
      'translation': 'roles_and_permissions',
      'route': 'Roles',
      'subgroup': 'users_and_permissions',
      'permission_scope': 'workspace',
      'permission_sets': [
        ['roles__list'],
        ['roles__create']
      ]
    },
    {
      'translation': 'activity_log',
      'route': 'ActivityLog',
      'subgroup': 'users_and_permissions',
      'permission_scope': 'workspace',
      'permission_sets': [
        ['audit_logs__view']
      ]
    },
    {
      'translation': 'api_keys',
      'route': 'ExternalApiKeys',
      'subgroup': 'users_and_permissions',
      'permission_scope': 'workspace',
      'permission_sets': [
        ['workspaces__manage_api_keys']
      ]
    },
    {
      'subgroup': 'support',
      'translation': 'hardware_setup',
      'route': 'documentation',
      'allowed_products': ['captive_portal'],
      'target': '_blank'
    },
    {
      'subgroup': 'support',
      'translation': 'make_a_wish',
      'click_handler': 'onClickMakeAWish'
    },

    {
      'subgroup': 'administration',
      'translation': 'devices',
      'route': 'Devices'
    }
  ]
}
