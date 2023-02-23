import store from '@/store'
import router from '@/router'
import _ from 'lodash'

export const EventTracker = {

  sendPageView (name, properties) {
    try {
      window.analytics.page(name, properties)
    } catch (error) {
      console.error(error)
    }
  },

  sendEvent (name, properties) {
    try {
      // Get default event properties
      let eventProperties = this.getDefaultEventProperties(name)

      // If event has a feature mapping, add feature to properties as well
      const eventFeature = FEATURES.find(feature => feature.events.indexOf(name) > -1)
      if (eventFeature) {
        eventProperties['feature'] = eventFeature.name
      }

      // Extend event properties with manually provided properties
      _.extend(eventProperties, (properties || {}))

      window.analytics.track(name, eventProperties)
    } catch (error) {
      console.error(error)
    }
  },

  identifyUser (id, properties) {
    try {
      // Set selected workspace name, if exists
      if (store.state.layout.selectedWorkspace.name) {
        properties.workspace_name = store.state.layout.selectedWorkspace.name
      }

      window.analytics.identify(id, properties)
    } catch (error) {
      console.error(error)
    }
  },

  clearSession () {
    try {
      window.analytics.reset()
    } catch (error) {
      console.error(error)
    }
  },

  getDefaultEventProperties () {
    // Currently selected workspace / organization name and id
    // Current page
    const defaultProperties = {}

    if (store.state.layout.selectedWorkspace.id) {
      defaultProperties.workspace_id = store.state.layout.selectedWorkspace.id
    }

    if (store.state.layout.selectedWorkspace.name) {
      defaultProperties.workspace_name = store.state.layout.selectedWorkspace.name
    }

    if (store.state.layout.selectedOrganization.id) {
      defaultProperties.organization_id = store.state.layout.selectedOrganization.id
    }

    if (store.state.layout.selectedOrganization.name) {
      defaultProperties.organization_name = store.state.layout.selectedOrganization.name
    }

    if (router.currentRoute) {
      defaultProperties.page = this.getRoutePageName(router.currentRoute)
    }

    return defaultProperties
  },

  getRoutePageName (route) {
    return route.meta.descriptiveName ? route.meta.descriptiveName : (route.meta.title ? route.meta.title : route.name)
  }

}

export const EVENT_NAMES = {
  USER_REGISTERED: 'User Registered',
  LOGIN_PASSWORD_SHOWN: 'Login Password Shown',
  USER_LOGGED_IN_VIA_PASSWORD: 'User Logged in Via Password',
  USER_LOGGED_IN_VIA_TFA: 'User Logged in Via 2fa',
  USER_LOGGED_IN_VIA_SSO: 'User Logged in Via SSO',
  USER_LOGGED_OUT: 'User Logged Out',
  USER_LOGGED_IN_FIRST_TIME: 'User Logged in First Time',
  PASSWORD_RESET_REQUESTED: 'Password Reset Requested',
  PASSWORD_RESET_CHANGED: 'Password Reset Changed',
  PRODUCT_SELECTED: 'Product Selected',
  PRODUCT_SELECTOR_OPENED: 'Product Selector Opened',
  PERSONAL_INFO_UPDATED: 'Personal Info Updated',
  PROFILE_PREFERENCES_UPDATED: 'Profile Preferences Updated',
  USER_PASSWORD_CHANGED: 'User Password Changed',
  EMAIL_CHANGE_REQUESTED: 'Email Change Requested',
  EMAIL_CHANGE_CONFIRMED: 'Email Change Confirmed',
  ORGANIZATION_CHANGED: 'Organization Changed',
  VENUE_CHANGED: 'Venue Changed',
  ORGANIZATION_RENAMED: 'Organization Renamed',
  ORGANIZATION_DATA_EXPORTED: 'Organization Data Exported',
  ORGANIZATION_DELETED: 'Organization Deleted',
  DASHBOARD_SSO_CONFIGURED: 'Dashboard SSO Configured',
  DASHBOARD_SSO_REMOVED: 'Dashboard SSO Removed',
  MSP_MANAGER_INVITED: 'MSP Manager Invited',
  MSP_MANAGER_ROLE_CHANGED: 'MSP Manager Role Changed',
  MSP_MANAGER_REVOKED: 'MSP Manager Revoked',
  USER_ACCESS_MODIFIED: 'User Access Modified',
  USER_ACCESS_REVOKED: 'User Access Revoked',
  USER_INVITATION_SENT: 'User Invitation Sent',
  USER_LIST_SEARCHED: 'User List Searched',
  ROLE_LIST_SEARCHED: 'Role List Searched',
  CUSTOM_ROLE_STARTED: 'Custom Role Started',
  CUSTOM_ROLE_CREATED: 'Custom Role Created',
  CUSTOM_ROLE_MODIFIED: 'Custom Role Modified',
  CUSTOM_ROLE_DELETED: 'Custom Role Deleted',
  ACTIVITY_LOG_ENTRY_VIEWED: 'Activity Log Entry Viewed',
  ACTIVITY_LOG_SEARCHED: 'Activity Log Searched',
  DOCUMENTATION_OPENED: 'Documentation Opened',
  CUSTOM_LOGO_UPLOADED: 'Custom Logo Uploaded',
  CUSTOM_LOGO_REMOVED: 'Custom Logo Removed',
  CUSTOM_LOGO_USAGE_CHANGED: 'Custom Logo Usage Changed',
  SECURITY_SETTINGS_CHANGED: 'Security Settings Changed',
  CUSTOM_SMTP_CONFIGURED: 'Custom SMTP Configured',
  CUSTOM_SMTP_TESTED: 'Custom SMTP Tested',
  CUSTOM_SMTP_REMOVED: 'Custom SMTP Removed',
  CUSTOM_SMS_CONFIGURED: 'Custom SMS Configured',
  CUSTOM_SMS_TESTED: 'Custom SMS Tested',
  CUSTOM_SMS_REMOVED: 'Custom SMS Removed',
  CUSTOM_OAUTH_PROVIDER_CONFIGURED: 'Custom OAuth Provider Configured',
  PORTAL_ANALYTICS_TIME_RANGE_CHANGED: 'Portal Analytics Time Range Changed',
  VISITORS_LIST_DOWNLOADED: 'Visitors List Downloaded',
  VISITORS_LIST_SEARCHED: 'Visitors List Searched',
  VISITOR_DELETED: 'Visitor Deleted',
  MEDIA_LIBRARY_SORTED: 'Media Library Sorted',
  MEDIA_ASSET_DELETED: 'Media Asset Deleted',
  MEDIA_ASSET_FILE_UPLOADED: 'Media Asset File Uploaded',
  MEDIA_ASSET_META_DATA_CHANGED: 'Media Asset Meta Data Changed',
  MEDIA_ASSET_CROPPED: 'Media Asset Cropped',
  MEDIA_ASSET_URL_UPLOADED: 'Media Asset URL Uploaded',
  SPLASH_PAGE_PREVIEWED: 'Splash Page Previewed',
  SPLASH_PAGE_DUPLICATED: 'Splash Page Duplicated',
  SPLASH_PAGE_DELETED: 'Splash Page Deleted',
  SPLASH_PAGE_LIST_SORTED: 'Splash Page List Sorted',
  SPLASH_PAGE_LIST_CUSTOMIZED: 'Splash Page List Customized',
  SPLASH_PAGE_LIST_REFRESHED: 'Splash Page List Refreshed',
  SPLASH_PAGE_BATCH_DELETED: 'Splash Page Batch Deleted',
  SPLASH_PAGE_LIST_SEARCHED: 'Splash Page List Searched',
  CAMPAIGN_URL_COPIED: 'Campaign URL Copied',
  CAMPAIGN_DELETED: 'Campaign Deleted',
  CAMPAIGN_LIST_REFRESHED: 'Campaign List Refreshed',
  CAMPAIGN_LIST_SORTED: 'Campaign List Sorted',
  CAMPAIGN_LIST_CUSTOMIZED: 'Campaign List Customized',
  CAMPAIGN_LIST_SEARCHED: 'Campaign List Searched',
  CAMPAIGN_BATCH_DELETED: 'Campaign Batch Deleted',
  CAMPAIGN_CREATED: 'Campaign Created',
  CAMPAIGN_MODIFIED: 'Campaign Modified',
  SPLASH_PAGE_CREATED: 'Splash Page Created',
  SPLASH_PAGE_PUBLISHED: 'Splash Page Published',
  DEVICE_MANUALLY_IMPORTED: 'Device Manually Imported',
  DEVICE_FILE_IMPORTED: 'Device File Imported',
  DEVICE_MOVED_TO_VENUE: 'Device Moved to Venue',
  DEVICE_REMOVED_FROM_VENUE: 'Device Removed from Venue',
  DEVICE_REMOVED_FROM_ORGANIZATION: 'Device Removed from Organization',
  DEVICE_INVENTORY_SEARCHED: 'Device Inventory Searched',
  DEVICE_INVENTORY_SORTED: 'Device Inventory Sorted',
  DEVICE_INVENTORY_REFRESHED: 'Device Inventory Refreshed',
  VENUE_GROUP_CREATED: 'Venue Group Created',
  VENUE_DELETED: 'Venue Deleted',
  VENUE_MOVED: 'Venue Moved',
  VENUE_DETAIL_VIEWED: 'Venue Detail Viewed',
  VENUE_CREATION_STARTED: 'Venue Creation Started',
  VENUE_CREATION_FINISHED: 'Venue Creation Finished',
  MERAKI_API_KEY_UPDATED: 'Meraki API Key Updated',
  MERAKI_DATA_REMOVED: 'Meraki Data Removed',
  MERAKI_DATA_REFRESHED: 'Meraki Data Refreshed',
  MERAKI_SSID_CREATED: 'Meraki SSID Created',
  MERAKI_SSID_CONFIGURED: 'Meraki SSID Configured',
  MERAKI_SSID_NETWORKS_SEARCHED: 'Meraki SSID Networks Searched',
  GUEST_WIFI_SETTINGS_CUSTOMIZED: 'Guest Wifi Settings Customized',
  SPONSOR_LIST_MODIFIED: 'Sponsor List Modified',
  GUEST_TICKET_CREATED: 'Guest Ticket Created',
  VOUCHER_CODES_GENERATED: 'Voucher Codes Generated',
  VOUCHER_CODES_DELETED: 'Voucher Codes Deleted',
  VOUCHER_CSV_DOWNLOADED: 'Voucher CSV Downloaded',
  VOUCHER_XLS_DOWNLOADED: 'Voucher XLS Downloaded',
  VOUCHER_CODES_VIEWED: 'Voucher Codes Viewed',
  VOUCHER_CODES_UPDATED: 'Voucher Codes Updated',
  LDAP_AUTHENTICATION_CONFIGURED: 'LDAP Authentication Configured',
  SSO_AUTHENTICATION_CONFIGURED: 'SSO Authentication Configured',
  FLEXTEMPLATE_CREATED: 'FlexTemplate Created',
  FLEXTEMPLATE_SAVED: 'FlexTemplate Saved',
  FLEXTEMPLATE_DEPLOYED: 'FlexTemplate Deployed',
  FLEXTEMPLATE_DELETED: 'FlexTemplate Deleted',
  MONITORED_NETWORKS_SEARCHED: 'Monitored Networks Searched',
  MONITORED_CLIENTS_SEARCHED: 'Monitored Clients Searched',
  MONITORED_CLIENTS_CSV_DOWNLOADED: 'Monitored Clients CSV Downloaded',
  MONITORED_CLIENTS_FILTERED: 'Monitored Clients Filtered',
  MONITORED_DEVICES_SEARCHED: 'Monitored Devices Searched',
  MONITORED_DEVICES_CSV_DOWNLOADED: 'Monitored Devices CSV Downloaded',
  MONITORED_DEVICE_REBOOTED: 'Monitored Device Rebooted',
  MONITORED_DEVICE_UPDATED: 'Monitored Device Updated',
  MONITORED_DEVICE_REMOVED_FROM_NETWORK: 'Monitored Device Removed From Network',
  MONITORED_DEVICES_MOVED_TO_NETWORK: 'Monitored Devices Moved To Network',
  MONITORED_NETWORKS_CLONED: 'Monitored Networks Cloned',
  SECURITY_COMPLIANCE_RULE_STARTED: 'Security Compliance Rule Started',
  SECURITY_COMPLIANCE_RULE_SAVED: 'Security Compliance Rule Saved',
  SECURITY_COMPLIANCE_RULE_VIOLATED: 'Security Compliance Rule Violated',
  SECURITY_COMPLIANCE_VIOLATIONS_VIEWED: 'Security Compliance Violations Viewed',
  SECURITY_COMPLIANCE_RULE_DELETED: 'Security Compliance Rule Deleted',
  NAME_COMPLIANCE_RULE_STARTED: 'Name Compliance Rule Started',
  NAME_COMPLIANCE_RULE_SAVED: 'Name Compliance Rule Saved',
  NAME_COMPLIANCE_RULE_VIOLATED: 'Name Compliance Rule Violated',
  NAME_COMPLIANCE_VIOLATIONS_VIEWED: 'Name Compliance Violations Viewed',
  NAME_COMPLIANCE_RULE_DELETED: 'Name Compliance Rule Deleted',
  CONFIGURATION_COMPLIANCE_RULE_STARTED: 'Configuration Compliance Rule Started',
  CONFIGURATION_COMPLIANCE_RULE_SAVED: 'Configuration Compliance Rule Saved',
  CONFIGURATION_COMPLIANCE_RULE_VIOLATED: 'Configuration Compliance Rule Violated',
  CONFIGURATION_COMPLIANCE_VIOLATIONS_VIEWED: 'Configuration Compliance Violations Viewed',
  CONFIGURATION_COMPLIANCE_RULE_DELETED: 'Configuration Compliance Rule Deleted',
  MERAKI_TAG_DELETED: 'Meraki Tag Deleted',
  MERAKI_TAG_RENAMED: 'Meraki Tag Renamed',
  MERAKI_RESOURCE_UNTAGGED: 'Meraki Resource Untagged',
  MERAKI_TAG_CSV_DOWNLOADED: 'Meraki Tag CSV Downloaded',
  MERAKI_RESOURCE_TAGGED: 'Meraki Resource Tagged',
  MERAKI_TAGS_SEARCHED: 'Meraki Tags Searched',
  MERAKI_TAGGED_RESOURCES_SEARCHED: 'Meraki Tagged Resources Searched',
  CUSTOM_DASHBOARD_STARTED: 'Custom Dashboard Started',
  CUSTOM_DASHBOARD_DELETED: 'Custom Dashboard Deleted',
  CUSTOM_DASHBOARD_WIDGET_ADDED: 'Custom Dashboard Widget Added',
  CUSTOM_DASHBOARD_SAVED: 'Custom Dashboard Saved',
  CUSTOM_DASHBOARD_USED: 'Custom Dashboard Used',
  API_KEY_ADDED: 'API Key Added',
  API_KEYS_SEARCHED: 'API Keys Searched',
  API_KEY_ORGANIZATIONS_VIEWED: 'API Key Organizations Viewed',
  API_KEY_ORGANIZATIONS_REFRESHED: 'API Key Organizations Refreshed',
  API_KEY_MODIFIED: 'API Key Modified',
  API_KEY_DELETED: 'API Key Deleted',
  MANAGED_ORGANIZATIONS_SEARCHED: 'Managed Organizations Searched',
  MANAGED_ORGANIZATION_CREATED: 'Managed Organization Created',
  MANAGED_ORGANIZATION_CLONED: 'Managed Organization Cloned',
  MANAGEMENT_RIGHTS_REQUESTED: 'Management Rights Requested',
  ORGANIZATION_UNMANAGED: 'Organization Unmanaged',
  MSP_ORGANIZATION_DELETED: 'Organization Deleted by MSP',
  ORGANIZATION_MODIFIED: 'Organization Modified',
  ORGANIZATION_BATCH_DELETED: 'Organization Batch Deleted',
  ORGANIZATION_IMPORTED: 'Organization Imported'
}

export const FEATURES = [
  {
    name: 'Registration',
    events: [
      EVENT_NAMES.USER_REGISTERED
    ]
  },
  {
    name: 'Login',
    events: [
      EVENT_NAMES.LOGIN_PASSWORD_SHOWN, EVENT_NAMES.USER_LOGGED_IN_VIA_PASSWORD, EVENT_NAMES.USER_LOGGED_IN_VIA_SSO,
      EVENT_NAMES.USER_LOGGED_IN_VIA_TFA
    ]
  },
  {
    name: 'Backend',
    events: [
      EVENT_NAMES.USER_LOGGED_IN_FIRST_TIME, EVENT_NAMES.SECURITY_COMPLIANCE_RULE_VIOLATED,
      EVENT_NAMES.NAME_COMPLIANCE_RULE_VIOLATED, EVENT_NAMES.CONFIGURATION_COMPLIANCE_RULE_VIOLATED
    ]
  },
  {
    name: 'Platform',
    events: [
      EVENT_NAMES.USER_LOGGED_OUT, EVENT_NAMES.PASSWORD_RESET_REQUESTED, EVENT_NAMES.PRODUCT_SELECTED,
      EVENT_NAMES.PRODUCT_SELECTOR_OPENED, EVENT_NAMES.ORGANIZATION_CHANGED, EVENT_NAMES.VENUE_CHANGED
    ]
  },
  {
    name: 'Profile',
    events: [
      EVENT_NAMES.PERSONAL_INFO_UPDATED, EVENT_NAMES.PROFILE_PREFERENCES_UPDATED, EVENT_NAMES.USER_PASSWORD_CHANGED,
      EVENT_NAMES.EMAIL_CHANGE_REQUESTED
    ]
  },
  {
    name: 'Email',
    events: [
      EVENT_NAMES.EMAIL_CHANGE_CONFIRMED
    ]
  },
  {
    name: 'General Settings',
    events: [
      EVENT_NAMES.ORGANIZATION_RENAMED, EVENT_NAMES.ORGANIZATION_DATA_EXPORTED, EVENT_NAMES.ORGANIZATION_DELETED
    ]
  },
  {
    name: 'SSO Settings',
    events: [
      EVENT_NAMES.DASHBOARD_SSO_CONFIGURED, EVENT_NAMES.DASHBOARD_SSO_REMOVED
    ]
  },
  {
    name: ' Settings',
    events: [
      EVENT_NAMES.MSP_MANAGER_INVITED, EVENT_NAMES.MSP_MANAGER_ROLE_CHANGED, EVENT_NAMES.MSP_MANAGER_REVOKED
    ]
  },
  {
    name: 'User Management',
    events: [
      EVENT_NAMES.USER_ACCESS_MODIFIED, EVENT_NAMES.USER_ACCESS_REVOKED, EVENT_NAMES.USER_INVITATION_SENT,
      EVENT_NAMES.USER_LIST_SEARCHED
    ]
  },
  {
    name: 'Role Management',
    events: [
      EVENT_NAMES.ROLE_LIST_SEARCHED, EVENT_NAMES.CUSTOM_ROLE_STARTED, EVENT_NAMES.CUSTOM_ROLE_CREATED,
      EVENT_NAMES.CUSTOM_ROLE_MODIFIED, EVENT_NAMES.CUSTOM_ROLE_DELETED
    ]
  },
  {
    name: 'Audit Log',
    events: [
      EVENT_NAMES.ACTIVITY_LOG_ENTRY_VIEWED, EVENT_NAMES.ACTIVITY_LOG_SEARCHED
    ]
  },
  {
    name: 'Support',
    events: [
      EVENT_NAMES.DOCUMENTATION_OPENED
    ]
  },
  {
    name: 'Branding Settings',
    events: [
      EVENT_NAMES.CUSTOM_LOGO_UPLOADED, EVENT_NAMES.CUSTOM_LOGO_REMOVED, EVENT_NAMES.CUSTOM_LOGO_USAGE_CHANGED
    ]
  },
  {
    name: 'Security Settings',
    events: [
      EVENT_NAMES.SECURITY_SETTINGS_CHANGED
    ]
  },
  {
    name: 'Portal Settings',
    events: [
      EVENT_NAMES.CUSTOM_SMTP_CONFIGURED, EVENT_NAMES.CUSTOM_SMTP_TESTED, EVENT_NAMES.CUSTOM_SMTP_REMOVED,
      EVENT_NAMES.CUSTOM_SMS_CONFIGURED, EVENT_NAMES.CUSTOM_SMS_TESTED, EVENT_NAMES.CUSTOM_SMS_REMOVED,
      EVENT_NAMES.CUSTOM_OAUTH_PROVIDER_CONFIGURED
    ]
  },
  {
    name: 'Portal Analytics',
    events: [
      EVENT_NAMES.PORTAL_ANALYTICS_TIME_RANGE_CHANGED
    ]
  },
  {
    name: 'Connected Visitors',
    events: [
      EVENT_NAMES.VISITORS_LIST_DOWNLOADED, EVENT_NAMES.VISITORS_LIST_SEARCHED, EVENT_NAMES.VISITOR_DELETED
    ]
  },
  {
    name: 'Media Library',
    events: [
      EVENT_NAMES.MEDIA_LIBRARY_SORTED, EVENT_NAMES.MEDIA_ASSET_DELETED, EVENT_NAMES.MEDIA_ASSET_FILE_UPLOADED,
      EVENT_NAMES.MEDIA_ASSET_META_DATA_CHANGED, EVENT_NAMES.MEDIA_ASSET_CROPPED, EVENT_NAMES.MEDIA_ASSET_URL_UPLOADED
    ]
  },
  {
    name: 'Splash Page Templates',
    events: [
      EVENT_NAMES.SPLASH_PAGE_PREVIEWED, EVENT_NAMES.SPLASH_PAGE_DUPLICATED, EVENT_NAMES.SPLASH_PAGE_DELETED,
      EVENT_NAMES.SPLASH_PAGE_LIST_SORTED, EVENT_NAMES.SPLASH_PAGE_LIST_CUSTOMIZED,
      EVENT_NAMES.SPLASH_PAGE_LIST_REFRESHED, EVENT_NAMES.SPLASH_PAGE_BATCH_DELETED,
      EVENT_NAMES.SPLASH_PAGE_LIST_SEARCHED
    ]
  },
  {
    name: 'Campaigns',
    events: [
      EVENT_NAMES.CAMPAIGN_URL_COPIED, EVENT_NAMES.CAMPAIGN_DELETED, EVENT_NAMES.CAMPAIGN_LIST_REFRESHED,
      EVENT_NAMES.CAMPAIGN_LIST_SORTED, EVENT_NAMES.CAMPAIGN_LIST_CUSTOMIZED, EVENT_NAMES.CAMPAIGN_LIST_SEARCHED,
      EVENT_NAMES.CAMPAIGN_BATCH_DELETED, EVENT_NAMES.CAMPAIGN_CREATED, EVENT_NAMES.CAMPAIGN_MODIFIED
    ]
  },
  {
    name: 'Builder',
    events: [
      EVENT_NAMES.SPLASH_PAGE_CREATED, EVENT_NAMES.SPLASH_PAGE_PUBLISHED
    ]
  },
  {
    name: 'Devices',
    events: [
      EVENT_NAMES.DEVICE_MANUALLY_IMPORTED, EVENT_NAMES.DEVICE_FILE_IMPORTED, EVENT_NAMES.DEVICE_MOVED_TO_VENUE,
      EVENT_NAMES.DEVICE_REMOVED_FROM_VENUE, EVENT_NAMES.DEVICE_REMOVED_FROM_ORGANIZATION,
      EVENT_NAMES.DEVICE_INVENTORY_SEARCHED, EVENT_NAMES.DEVICE_INVENTORY_SORTED, EVENT_NAMES.DEVICE_INVENTORY_REFRESHED
    ]
  },
  {
    name: 'Venues',
    events: [
      EVENT_NAMES.VENUE_GROUP_CREATED, EVENT_NAMES.VENUE_DELETED, EVENT_NAMES.VENUE_MOVED,
      EVENT_NAMES.VENUE_DETAIL_VIEWED, EVENT_NAMES.VENUE_CREATION_STARTED, EVENT_NAMES.VENUE_CREATION_FINISHED
    ]
  },
  {
    name: 'Meraki Setup',
    events: [
      EVENT_NAMES.MERAKI_API_KEY_UPDATED, EVENT_NAMES.MERAKI_DATA_REMOVED, EVENT_NAMES.MERAKI_DATA_REFRESHED
    ]
  },
  {
    name: 'Hardware Setup',
    events: [
      EVENT_NAMES.MERAKI_SSID_CREATED, EVENT_NAMES.MERAKI_SSID_CONFIGURED, EVENT_NAMES.MERAKI_SSID_NETWORKS_SEARCHED
    ]
  },
  {
    name: 'Authentication Settings',
    events: [
      EVENT_NAMES.GUEST_WIFI_SETTINGS_CUSTOMIZED, EVENT_NAMES.SPONSOR_LIST_MODIFIED, EVENT_NAMES.GUEST_TICKET_CREATED,
      EVENT_NAMES.VOUCHER_CODES_GENERATED, EVENT_NAMES.VOUCHER_CODES_DELETED, EVENT_NAMES.VOUCHER_CSV_DOWNLOADED,
      EVENT_NAMES.VOUCHER_XLS_DOWNLOADED, EVENT_NAMES.VOUCHER_CODES_VIEWED, EVENT_NAMES.VOUCHER_CODES_UPDATED,
      EVENT_NAMES.LDAP_AUTHENTICATION_CONFIGURED, EVENT_NAMES.SSO_AUTHENTICATION_CONFIGURED
    ]
  },
  {
    name: 'FlexTemplates',
    events: [
      EVENT_NAMES.FLEXTEMPLATE_CREATED, EVENT_NAMES.FLEXTEMPLATE_SAVED, EVENT_NAMES.FLEXTEMPLATE_DEPLOYED,
      EVENT_NAMES.FLEXTEMPLATE_DELETED
    ]
  },
  {
    name: 'Client Monitoring',
    events: [
      EVENT_NAMES.MONITORED_CLIENTS_SEARCHED, EVENT_NAMES.MONITORED_CLIENTS_CSV_DOWNLOADED,
      EVENT_NAMES.MONITORED_CLIENTS_FILTERED
    ]
  },
  {
    name: 'Device Monitoring',
    events: [
      EVENT_NAMES.MONITORED_DEVICES_SEARCHED, EVENT_NAMES.MONITORED_DEVICES_CSV_DOWNLOADED,
      EVENT_NAMES.MONITORED_DEVICE_REBOOTED, EVENT_NAMES.MONITORED_DEVICE_UPDATED,
      EVENT_NAMES.MONITORED_DEVICE_REMOVED_FROM_NETWORK, EVENT_NAMES.MONITORED_DEVICES_MOVED_TO_NETWORK
    ]
  },
  {
    name: 'Security Compliance',
    events: [
      EVENT_NAMES.SECURITY_COMPLIANCE_RULE_STARTED, EVENT_NAMES.SECURITY_COMPLIANCE_RULE_SAVED,
      EVENT_NAMES.SECURITY_COMPLIANCE_VIOLATIONS_VIEWED, EVENT_NAMES.SECURITY_COMPLIANCE_RULE_DELETED
    ]
  },
  {
    name: 'Name Compliance',
    events: [
      EVENT_NAMES.NAME_COMPLIANCE_RULE_STARTED, EVENT_NAMES.NAME_COMPLIANCE_RULE_SAVED,
      EVENT_NAMES.NAME_COMPLIANCE_VIOLATIONS_VIEWED, EVENT_NAMES.NAME_COMPLIANCE_RULE_DELETED
    ]
  },
  {
    name: 'Configuration Compliance',
    events: [
      EVENT_NAMES.CONFIGURATION_COMPLIANCE_RULE_STARTED, EVENT_NAMES.CONFIGURATION_COMPLIANCE_RULE_SAVED,
      EVENT_NAMES.CONFIGURATION_COMPLIANCE_VIOLATIONS_VIEWED, EVENT_NAMES.CONFIGURATION_COMPLIANCE_RULE_DELETED
    ]
  },
  {
    name: 'Tag Manager',
    events: [
      EVENT_NAMES.MERAKI_TAG_DELETED, EVENT_NAMES.MERAKI_TAG_RENAMED, EVENT_NAMES.MERAKI_RESOURCE_UNTAGGED,
      EVENT_NAMES.MERAKI_TAG_CSV_DOWNLOADED, EVENT_NAMES.MERAKI_RESOURCE_TAGGED, EVENT_NAMES.MERAKI_TAGS_SEARCHED,
      EVENT_NAMES.MERAKI_TAGGED_RESOURCES_SEARCHED
    ]
  },
  {
    name: 'Custom Dashboards',
    events: [
      EVENT_NAMES.CUSTOM_DASHBOARD_STARTED, EVENT_NAMES.CUSTOM_DASHBOARD_DELETED,
      EVENT_NAMES.CUSTOM_DASHBOARD_WIDGET_ADDED, EVENT_NAMES.CUSTOM_DASHBOARD_SAVED, EVENT_NAMES.CUSTOM_DASHBOARD_USED
    ]
  },
  {
    name: 'API Key Manager',
    events: [
      EVENT_NAMES.API_KEY_ADDED, EVENT_NAMES.API_KEYS_SEARCHED, EVENT_NAMES.API_KEY_ORGANIZATIONS_VIEWED,
      EVENT_NAMES.API_KEY_ORGANIZATIONS_REFRESHED, EVENT_NAMES.API_KEY_MODIFIED, EVENT_NAMES.API_KEY_DELETED
    ]
  },
  {
    name: 'Organization Manager',
    events: [
      EVENT_NAMES.MANAGED_ORGANIZATIONS_SEARCHED, EVENT_NAMES.MANAGED_ORGANIZATION_CREATED,
      EVENT_NAMES.MANAGEMENT_RIGHTS_REQUESTED, EVENT_NAMES.ORGANIZATION_UNMANAGED, EVENT_NAMES.MSP_ORGANIZATION_DELETED,
      EVENT_NAMES.ORGANIZATION_MODIFIED, EVENT_NAMES.ORGANIZATION_BATCH_DELETED, EVENT_NAMES.ORGANIZATION_IMPORTED,
      EVENT_NAMES.MANAGED_ORGANIZATION_CLONED
    ]
  }
]
