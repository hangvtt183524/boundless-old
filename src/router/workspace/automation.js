const TemplateList = () => import(/* webpackChunkName: "monitoring" */ '@/components/meraki/templates/template-list/template-list')
const TemplateDetail = () => import(/* webpackChunkName: "monitoring" */ '@/components/meraki/templates/template-detail/template-detail')
const TemplateDeployment = () => import(/* webpackChunkName: "monitoring" */ '@/components/meraki/templates/template-deployment/template-deployment')
const WifiClients = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/wifi-clients/index')
const WifiClientDetail = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/wifi-clients/detail')
const MerakiDevices = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/meraki-devices/index')
const MerakiDeviceDetail = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/meraki-devices/detail')
const MerakiNetworks = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/meraki-networks/index')
const MerakiSwitchPorts = () => import(/* webpackChunkName: "monitoring" */ '@/components/monitoring/meraki-switch-ports/index')
const SecurityComplianceRuleSetList = () => import('@/components/meraki/security-compliance/security-compliance-rule-set-list/security-compliance-rule-set-list')
const SecurityComplianceRuleSetDetail = () => import('@/components/meraki/security-compliance/security-compliance-rule-set-detail/security-compliance-rule-set-detail')
const SecurityComplianceCheckDetail = () => import('@/components/meraki/security-compliance/compliance-check-detail/compliance-check-detail')
const NameComplianceRuleSetList = () => import('@/components/meraki/name-compliance/name-compliance-rule-set-list/name-compliance-rule-set-list')
const NameComplianceRuleSetDetail = () => import('@/components/meraki/name-compliance/name-compliance-rule-set-detail/name-compliance-rule-set-detail')
const NameComplianceCheckDetail = () => import('@/components/meraki/name-compliance/compliance-check-detail/compliance-check-detail')
const ConfigurationComplianceRuleSetList = () => import('@/components/meraki/configuration-compliance/configuration-compliance-rule-set-list/configuration-compliance-rule-set-list')
const ConfigurationComplianceRuleSetDetail = () => import('@/components/meraki/configuration-compliance/configuration-compliance-rule-set-detail/configuration-compliance-rule-set-detail')
const ConfigurationComplianceCheckDetail = () => import('@/components/meraki/configuration-compliance/compliance-check-detail/compliance-check-detail')
const TagsDashboard = () => import('@/components/meraki/tags/tags-dashboard/tags-dashboard')
const OrganizationList = () => import(/* webpackChunkName: "org-create" */ '@/components/workspace/organizations/list')
const OrganizationDetail = () => import(/* webpackChunkName: "org-create" */ '@/components/workspace/organizations/detail')
const OrganizationImport = () => import(/* webpackChunkName: "org-create" */ '@/components/workspace/organizations/import-workspace-organizations')

export default [
  {
    path: 'automation/organizations',
    name: 'OrganizationList',
    component: OrganizationList,
    meta: {
      descriptiveName: 'Managed Organizations Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/organizations/import',
    name: 'OrganizationImport',
    component: OrganizationImport,
    meta: {
      descriptiveName: 'Organization Import',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/organizations/:workspaceOrganizationId',
    name: 'OrganizationDetail',
    component: OrganizationDetail,
    props: (route) => ({
      workspaceOrganizationId: route.params.workspaceOrganizationId
    }),
    meta: {
      title: 'Organization',
      descriptiveName: 'Managed Organization Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/flextemplates',
    name: 'TemplateList',
    component: TemplateList,
    meta: {
      title: 'Network FlexTemplates',
      descriptiveName: 'FlexTemplates',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/flextemplates/:templateId',
    name: 'TemplateDetail',
    component: TemplateDetail,
    props: (route) => ({
      templateId: route.params.templateId
    }),
    meta: {
      title: 'Update Template',
      descriptiveName: 'FlexTemplate Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/flextemplates/:templateId/customizations',
    name: 'TemplateCustomizations',
    component: TemplateDetail,
    props: (route) => ({
      templateId: route.params.templateId
    }),
    meta: {
      title: 'Update Template Customizations',
      descriptiveName: 'FlexTemplate Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/flextemplates/:templateId/deployment',
    name: 'TemplateDeployment',
    component: TemplateDeployment,
    props: (route) => ({
      templateId: route.params.templateId
    }),
    meta: {
      title: 'Deploy Template',
      descriptiveName: 'FlexTemplate Deployment',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/monitoring/clients',
    name: 'WifiClients',
    component: WifiClients,
    meta: {
      title: 'Clients',
      descriptiveName: 'Client Monitoring Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/monitoring/clients/:clientId',
    name: 'WifiClientDetail',
    component: WifiClientDetail,
    props: (route) => ({
      clientId: route.params.clientId
    }),
    meta: {
      title: 'Clients',
      descriptiveName: 'Client Monitoring Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/monitoring/devices',
    name: 'MerakiDevices',
    component: MerakiDevices,
    meta: {
      title: 'Devices',
      descriptiveName: 'Device Monitoring Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/monitoring/devices/:deviceId',
    name: 'MerakiDeviceDetail',
    component: MerakiDeviceDetail,
    props: (route) => ({
      deviceId: route.params.deviceId
    }),
    meta: {
      title: 'Devices',
      descriptiveName: 'Device Monitoring Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/monitoring/networks',
    name: 'MerakiNetworks',
    component: MerakiNetworks,
    meta: {
      title: 'Networks',
      descriptiveName: 'Network Monitoring Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/monitoring/switch-ports',
    name: 'MerakiSwitchPorts',
    component: MerakiSwitchPorts,
    meta: {
      title: 'Switch Ports',
      descriptiveName: 'Switch Port Monitoring Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/security',
    name: 'SecurityCompliance',
    component: SecurityComplianceRuleSetList,
    meta: {
      title: 'Security Compliance',
      descriptiveName: 'Security Compliance Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/security/new',
    name: 'NewSecurityComplianceRuleSet',
    component: SecurityComplianceRuleSetDetail,
    meta: {
      title: 'Create Rule Set',
      descriptiveName: 'Security Compliance Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/security/:ruleSetId',
    name: 'SecurityComplianceRuleSetDetail',
    component: SecurityComplianceRuleSetDetail,
    props: (route) => ({
      ruleSetId: route.params.ruleSetId
    }),
    meta: {
      title: 'Update Rule Set',
      descriptiveName: 'Security Compliance Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/security/alert/:complianceCheckId',
    name: 'SecurityComplianceCheckDetail',
    component: SecurityComplianceCheckDetail,
    props: (route) => ({
      complianceCheckId: route.params.complianceCheckId
    }),
    meta: {
      title: 'Compliance Alert Details',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/names',
    name: 'NameCompliance',
    component: NameComplianceRuleSetList,
    meta: {
      nodeRoles: ['organization'],
      title: 'Name Compliance',
      descriptiveName: 'Name Compliance Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/names/new',
    name: 'NewNameComplianceRuleSet',
    component: NameComplianceRuleSetDetail,
    meta: {
      title: 'Create Rule Set',
      descriptiveName: 'Name Compliance Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/names/:ruleSetId',
    name: 'NameComplianceRuleSetDetail',
    component: NameComplianceRuleSetDetail,
    props: (route) => ({
      ruleSetId: route.params.ruleSetId
    }),
    meta: {
      title: 'Update Rule Set',
      descriptiveName: 'Name Compliance Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/names/alert/:complianceCheckId',
    name: 'NameComplianceCheckDetail',
    component: NameComplianceCheckDetail,
    props: (route) => ({
      complianceCheckId: route.params.complianceCheckId
    }),
    meta: {
      title: 'Compliance Alert Details',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/configuration',
    name: 'ConfigurationCompliance',
    component: ConfigurationComplianceRuleSetList,
    meta: {
      title: 'Configuration Compliance',
      descriptiveName: 'Configuration Compliance Listing',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/configuration/new',
    name: 'NewConfigurationComplianceRuleSet',
    component: ConfigurationComplianceRuleSetDetail,
    meta: {
      title: 'Create Rule Set',
      descriptiveName: 'Configuration Compliance Rule Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/configuration/:ruleSetId',
    name: 'ConfigurationComplianceRuleSetDetail',
    component: ConfigurationComplianceRuleSetDetail,
    props: (route) => ({
      ruleSetId: route.params.ruleSetId
    }),
    meta: {
      title: 'Update Rule Set',
      descriptiveName: 'Configuration Compliance Rule Detail',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/tags',
    name: 'Tags',
    component: TagsDashboard,
    meta: {
      nodeRoles: ['organization'],
      title: 'Tags',
      descriptiveName: 'Tag Manager Tags',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/tags/resources',
    name: 'TagsResources',
    component: TagsDashboard,
    meta: {
      nodeRoles: ['organization'],
      title: 'Tags',
      descriptiveName: 'Tag Manager Resources',
      requiresApiKey: true
    }
  },
  {
    path: 'automation/compliance/configuration/alert/:complianceCheckId',
    name: 'ConfigurationComplianceCheckDetail',
    component: ConfigurationComplianceCheckDetail,
    props: (route) => ({
      complianceCheckId: route.params.complianceCheckId
    }),
    meta: {
      title: 'Compliance Alert Details',
      requiresApiKey: true
    }
  }
]
