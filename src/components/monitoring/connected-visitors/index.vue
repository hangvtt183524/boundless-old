<template lang='pug'>
  .page-content
    v-layout.mb-5
      v-flex(xs12, sm12, md6, lg6)
        h2 {{$t('general.visitors')}}
    base-table(
      :items="visitors"
      :table-headers="allowedHeaders"
      :loading="loading"
      :show-download="hasPermission('connected_visitors__export', selectedNode.id)"
      :row-clickable="true"
      @rowClicked="onItemClick"
      @download="onDownload"
      :table-pagination="pagination"
      :hideIcon="true"
      icon="fas fa-user-alt"
      item-key="id"
      :search-text="search"
      :useDefaultPagination="true",
      :total-items="totalItems"
      :is-tree="true"
      :tree-data="displayedTreeData"
      :tree-values="treeSelectedValues"
      @fetchData="fetchItems"
      @reloadData="fetchVisitors"
      @onSearch="searchItems"
    )
      template(slot="operating_system", slot-scope="{ item }")
        div(:title='item.operation_system | capitalize' v-if="recognizedOS(item.operation_system)")
          v-icon {{ 'fab fa-' + item.operation_system }}
        div(v-else)
          | {{ $t('visitors.unknown_operating_system') }}

      template(slot="auth_provider", slot-scope="{ item }")
        div(:title='$t(`social.${item.auth_provider}`)')
          v-icon(v-if="item.auth_provider === 'form'") fa-file-alt
          v-icon(v-else-if="item.auth_provider === 'sponsor'") fa-address-card
          v-icon(v-else-if="item.auth_provider === 'access-code'") fa-key
          v-icon(v-else-if="item.auth_provider === 'ldap'") fa-folder
          v-icon(v-else-if="item.auth_provider === 'saml'") fa-share
          v-icon(v-else-if="item.auth_provider === 'sms'") fa-comment
          v-icon(v-else-if="item.auth_provider === 'ticket'") fa-ticket-alt
          v-icon(v-else) {{ `fab fa-${item.auth_provider}` }}

      template(slot="node", slot-scope="{ item }")
        a.column-link(@click = "item.site && goToNodeDetail(item.site)") {{ item.site_name }}
      template(slot="campaign", slot-scope="{ item }")
        a.column-link(@click = "item.campaign && goToCampaignDetails(item.campaign)") {{ item.campaign_name }}
      template(slot="splashpage", slot-scope="{ item }")
        a.column-link(@click = "item.splashpage && goToSplashPage(item.splashpage)") {{ item.splashpage_name }}
      template(slot="ap_mac_address", slot-scope="{ item }")
        a.column-link(@click = "item.device && goToDeviceDetails(item.device)") {{ item.ap_mac_address }}
      template(
        slot="row-action"
        slot-scope="slotProps"
      )
        v-tooltip(bottom color="#9AA9C4" light)
          template(v-slot:activator="{ on }")
            .row-popover-item(
              v-if="hasPermission('connected_visitors__delete', selectedNode.id)"
              @click="onDeleteVisitorClick(slotProps.item)"
              v-on="on"
            )
              v-icon delete
          span {{ $t('tooltip.delete') }}

    confirm-dialog(ref="confirmDialog")

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import TableListingsMixin from '@/mixins/table-listings.mixin'
import BaseTable from '@/components/common/base-table'
import ConfirmDialog from '@/components/common/confirm-dialog'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'Visitors',

  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    TableListingsMixin
  ],
  components: {
    BaseTable,
    ConfirmDialog
  },

  data () {
    return {
      defaultProfilePicture: require('@/assets/images/profile-placeholder.png'),
      allHeaders: [
        { parentId: 2, text: this.$t('general.profilePhoto'), value: 'profile_picture', defaultValue: require('@/assets/images/profile-placeholder.png'), type: 'image', imageWidth: 40, sortable: false, selected: true, align: 'center' },
        { parentId: 2, text: this.$t('general.registrationDateTime'), value: 'registration_datetime', sortable: true, selected: true, formatter: this.dateTimeFormatter },
        { parentId: 2, text: this.$t('general.name'), sortable: false, selected: true, value: 'name' },
        { parentId: 2, text: this.$t('general.email'), sortable: false, selected: true, value: 'email' },
        { parentId: 1, text: this.$t('general.siteGroup'), sortable: true, type: 'slot', slotName: 'node', value: 'site_name', custom_sort_field: 'site__name', selected: true },
        { parentId: 2, text: this.$t('general.authenticationProvider'), sortable: false, value: 'auth_provider', selected: true, type: 'slot', slotName: 'auth_provider' },
        { parentId: 2, text: this.$t('general.clientMacAddress'), sortable: true, value: 'client_mac_address', selected: true },
        { parentId: 1, text: this.$t('general.accessPointMacAddress'), sortable: true, type: 'slot', slotName: 'ap_mac_address', value: 'ap_mac_address', selected: true },
        { parentId: 2, text: this.$t('general.operatingSystem'), sortable: false, selected: false, value: 'operation_system', type: 'slot', slotName: 'operating_system' },
        { parentId: 2, text: this.$t('general.device'), sortable: false, selected: false, value: 'device_type', formatter: this.capitalize },
        { parentId: 2, text: this.$t('general.browser'), sortable: false, selected: false, value: 'browser' },
        { parentId: 1, text: this.$t('general.campaign'), sortable: false, selected: false, type: 'slot', slotName: 'campaign', value: 'campaign_name' },
        { parentId: 1, text: this.$t('general.splashPage'), sortable: false, selected: false, type: 'slot', slotName: 'splashpage', value: 'splashpage_name' },
        { parentId: 2, text: this.$t('general.pageLanguage'), sortable: false, selected: false, value: 'page_language' },
        { parentId: 2, text: this.$t('general.deviceLanguage'), sortable: false, selected: false, value: 'device_language' },
        { parentId: 2, text: this.$t('general.userAgent'), sortable: false, value: 'user_agent', selected: false },
        { parentId: 3, text: this.$t('general.clientIpAddress'), sortable: false, value: 'client_ip_address', selected: false },
        { parentId: 3, text: this.$t('general.radiusUserName'), sortable: true, value: 'radius_user_name', selected: false },
        { parentId: 3, text: this.$t('general.sessionDuration'), sortable: false, value: 'session_duration', selected: false, formatter: this.convertSecToTimes },
        { parentId: 3, text: this.$t('general.connectionDateTime'), sortable: false, value: 'connection_datetime', selected: false, formatter: this.dateTimeFormatter },
        { parentId: 3, text: this.$t('general.disconnectionDateTime'), sortable: false, value: 'disconnection_datetime', selected: false, formatter: this.dateTimeFormatter },
        { parentId: 3, text: this.$t('general.uploadedData'), sortable: false, value: 'uploaded_data', selected: false },
        { parentId: 3, text: this.$t('general.downloadedData'), sortable: false, value: 'downloaded_data', selected: false },
        { parentId: 3, text: this.$t('general.connectionType'), sortable: false, value: 'connection_type', selected: false },
        { parentId: 3, text: this.$t('general.terminationCause'), sortable: false, value: 'termination_cause', selected: false },
        { parentId: 3, text: this.$t('general.sessionId'), sortable: false, value: 'session_id', selected: false },
        { parentId: 3, text: this.$t('general.uniqueId'), sortable: false, value: 'unique_id', selected: false },
        { parentId: 3, text: this.$t('general.radiusGroupName'), sortable: false, value: 'radius_group_name', selected: false },
        { parentId: 3, text: this.$t('general.realm'), sortable: false, value: 'realm', selected: false },
        { parentId: 3, text: this.$t('general.nasIpAddress'), sortable: false, value: 'nas_ip_address', selected: false },
        { parentId: 3, text: this.$t('general.nasPortId'), sortable: false, value: 'nas_port_id', selected: false },
        { parentId: 3, text: this.$t('general.nasPortType'), sortable: false, value: 'nas_port_type', selected: false },
        { parentId: 3, text: this.$t('general.updateDatetime'), sortable: false, value: 'update_datetime', selected: false },
        { parentId: 3, text: this.$t('general.interval'), sortable: false, value: 'interval', selected: false },
        { parentId: 3, text: this.$t('general.authentication'), sortable: false, value: 'authentication', selected: false },
        { parentId: 3, text: this.$t('general.connectionInfoStart'), sortable: false, value: 'connection_info_start', selected: false },
        { parentId: 3, text: this.$t('general.connectionInfoStop'), sortable: false, value: 'connection_info_stop', selected: false },
        { parentId: 3, text: this.$t('general.calledStationId'), sortable: false, value: 'called_station_id', selected: false },
        { parentId: 3, text: this.$t('general.callingStationId'), sortable: false, value: 'calling_station_id', selected: false },
        { parentId: 3, text: this.$t('general.framedProtocol'), sortable: false, value: 'framed_protocol', selected: false },
        { parentId: 3, text: this.$t('general.framedIpAddress'), sortable: false, value: 'framed_ip_address', selected: false },
        { parentId: 3, text: this.$t('general.ssid'), sortable: false, value: 'ssid', selected: false },

        { parentId: 5, text: this.$t('social.instagramUsername'), sortable: false, value: 'instagram_username', selected: false },

        { parentId: 6, text: this.$t('social.facebookName'), sortable: false, value: 'facebook_name', selected: false },
        { parentId: 6, text: this.$t('social.facebookFirstName'), sortable: false, value: 'facebook_first_name', selected: false },
        { parentId: 6, text: this.$t('social.facebookLastName'), sortable: false, value: 'facebook_last_name', selected: false },
        { parentId: 6, text: this.$t('social.facebookEmail'), sortable: false, value: 'facebook_email', selected: false },

        { parentId: 8, text: this.$t('social.linkedinName'), sortable: false, value: 'linkedin_name', selected: false },
        { parentId: 8, text: this.$t('social.linkedinFirstName'), sortable: false, value: 'linkedin_first_name', selected: false },
        { parentId: 8, text: this.$t('social.linkedinLastName'), sortable: false, value: 'linkedin_last_name', selected: false },
        { parentId: 8, text: this.$t('social.linkedinProfileUrl'), sortable: false, value: 'linkedin_profile_url', selected: false },
        { parentId: 8, text: this.$t('social.linkedinEmail'), sortable: false, value: 'linkedin_email', selected: false },
        { parentId: 8, text: this.$t('social.linkedinImageUrl'), sortable: false, value: 'linkedin_image_url', selected: false },
        { parentId: 8, text: this.$t('social.linkedinLocationName'), sortable: false, value: 'linkedin_location_name', selected: false },
        { parentId: 8, text: this.$t('social.linkedinUsername'), sortable: false, value: 'linkedin_username', selected: false },
        { parentId: 8, text: this.$t('social.linkedinIndustry'), sortable: false, value: 'linkedin_industry', selected: false },

        { parentId: 9, text: this.$t('social.twitterName'), sortable: false, value: 'twitter_name', selected: false },
        { parentId: 9, text: this.$t('social.twitterScreenName'), sortable: false, value: 'twitter_screen_name', selected: false },
        { parentId: 9, text: this.$t('social.twitterProfilePicture'), sortable: false, value: 'twitter_profile_picture', selected: false },
        { parentId: 9, text: this.$t('social.twitterFollowsCount'), sortable: false, value: 'twitter_followers_count', selected: false },
        { parentId: 9, text: this.$t('social.twitterFriendsCount'), sortable: false, value: 'twitter_friends_count', selected: false },

        { parentId: 10, text: this.$t('social.briteverifyAddress'), sortable: false, value: 'briteverify_address', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyAccount'), sortable: false, value: 'briteverify_account', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyDomain'), sortable: false, value: 'briteverify_domain', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyStatus'), sortable: false, value: 'briteverify_status', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyErrorcode'), sortable: false, value: 'briteverify_error_code', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyError'), sortable: false, value: 'briteverify_error', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyDisposable'), sortable: false, value: 'briteverify_disposable', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyRoleAddress'), sortable: false, value: 'briteverify_role_address', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyDuration'), sortable: false, value: 'briteverify_duration', selected: false },
        { parentId: 10, text: this.$t('social.briteverifyConnected'), sortable: false, value: 'briteverify_connected', selected: false },

        { parentId: 4, text: this.$t('social.customEmail'), sortable: false, value: 'custom_email', selected: false },
        { parentId: 4, text: this.$t('social.customPhone'), sortable: false, value: 'custom_phone', selected: false },
        { parentId: 4, text: this.$t('social.customFirstName'), sortable: false, value: 'custom_first_name', selected: false },
        { parentId: 4, text: this.$t('social.customLastName'), sortable: false, value: 'custom_last_name', selected: false },
        { parentId: 4, text: this.$t('monitoring.customMarketingConsent'), sortable: false, value: 'custom_marketing_consent', selected: false },

        { parentId: 7, text: this.$t('social.googleName'), sortable: false, value: 'google_name', selected: false },
        { parentId: 7, text: this.$t('social.googleFirstName'), sortable: false, value: 'google_first_name', selected: false },
        { parentId: 7, text: this.$t('social.googleLastName'), sortable: false, value: 'google_last_name', selected: false },
        { parentId: 7, text: this.$t('social.googleProfilePicture'), sortable: false, value: 'google_profile_picture', selected: false },

        { text: this.$t('general.reload'), sortable: false, align: 'right', value: 'reload', selected: true },
        { text: 'actions', sortable: false, align: 'center', value: 'actions', selected: true }
      ],
      allowedHeaders: [],
      treeData: this.getInitialTreeData(),
      treeSelectedValues: [],
      technicalFields: ['ap_mac_address', 'client_ip_address', 'client_mac_address', 'radius_user_name',
        'session_duration', 'connection_datetime', 'disconnection_datetime', 'uploaded_data',
        'downloaded_data', 'connection_type', 'termination_cause', 'session_id', 'unique_id',
        'radius_group_name', 'realm', 'nas_ip_address', 'nas_port_id', 'nas_port_type',
        'update_datetime', 'interval', 'authentication', 'connection_info_start',
        'connection_info_stop', 'called_station_id', 'calling_station_id', 'framed_protocol',
        'framed_ip_address', 'ssid'
      ],

      loading: false,
      search: '',
      totalItems: 0,
      pagination: {
        descending: true,
        rowsPerPage: 10,
        sortBy: 'registration_datetime',
        page: 1
      }
    }
  },

  computed: {
    ...mapGetters('organization/visitor', ['visitors']),
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode']),
    nodeId () {
      return this.$route.params.nodeId
    },
    displayedTreeData () {
      return this.treeData.filter(treeItem => {
        return treeItem.children.length > 0
      })
    }
  },

  mounted () {
    this.setAllowedHeaders()
    this.setTreeData()

    this.fetchVisitors()
  },
  methods: {
    ...mapActions('organization/visitor', ['deleteVisitor']),
    fetchItems (filter) {
      this.pagination = filter
      this.fetchVisitors()
    },
    searchItems (search) {
      this.search = search
      this.pagination.page = 1
      this.fetchVisitors()

      EventTracker.sendEvent(EVENT_NAMES.VISITORS_LIST_SEARCHED)
    },
    capitalize (value) {
      return this.$options.filters.capitalize(value)
    },
    fetchVisitors () {
      let filters = {
        nodeId: this.nodeId,
        page_size: this.pagination.rowsPerPage,
        page: this.pagination.page
      }
      if (this.pagination.ordering) {
        let ordering = this.pagination.ordering
        if (this.pagination.descending) {
          ordering = `-${ordering}`
        }
        filters.ordering = ordering
      }
      if (this.search) {
        filters.search = this.search
      }
      this.loading = true
      this.$store.dispatch('organization/visitor/fetchVisitors', filters).then(response => {
        this.totalItems = response.data.data.count
      }).finally(() => {
        this.loading = false
      })
    },
    onItemClick (item) {
      const query = this.$route.query || {}
      this.$router.push({ name: 'VisitorDetails', params: { visitorId: item.id }, query })
    },
    onDownload (filters) {
      filters.nodeId = this.nodeId
      filters.page = this.pagination.page
      filters.page_size = 0
      if (this.pagination.ordering) {
        let ordering = this.pagination.ordering
        if (this.pagination.descending) {
          ordering = `-${ordering}`
        }
        filters.ordering = ordering
      }
      if (this.search) {
        filters.search = this.search
      }
      this.$store.dispatch('organization/visitor/downloadVisitors', filters).then(response => {
        if (filters.send_email) {
          global.toastr['success'](this.$t('general.sentDownloadLink'), this.$t('general.success'))
        } else {
          var downloadUrl = URL.createObjectURL(response.data)
          var a = document.createElement('a')
          a.href = downloadUrl
          let fileName = [
            this.selectedOrganization.name || '',
            this.selectedNode.name || '',
            'wifi',
            filters.registration_datetime_after || '',
            filters.registration_datetime_before ? this.$moment(filters.registration_datetime_before).format('YYYY-MM-DD') : ''
          ].filter(item => item).join('-')
          a.download = `${fileName}.${filters.type}`
          document.body.appendChild(a)
          a.click()
        }
      })

      EventTracker.sendEvent(EVENT_NAMES.VISITORS_LIST_DOWNLOADED, {
        mail: filters.send_email,
        type: filters.type
      })
    },
    setAllowedHeaders () {
      let headers = JSON.parse(JSON.stringify(this.allHeaders))
      const staticHeaderKeys = ['actions', 'reload']

      // Remove marketing fields if there's no permission
      if (!this.hasPermission('connected_visitors__view_marketing_data', this.selectedNode.id)) {
        headers = headers.filter(header => {
          return this.technicalFields.indexOf(header.value) > -1 || (staticHeaderKeys.indexOf(header.value) > -1)
        })
      }

      // Remove technical fields if there's no permission
      if (!this.hasPermission('connected_visitors__view_technical_data', this.selectedNode.id)) {
        headers = headers.filter(header => {
          return this.technicalFields.indexOf(header.value) === -1 || (staticHeaderKeys.indexOf(header.value) > -1)
        })
      }

      this.$set(this, 'allowedHeaders', headers)
    },
    getInitialTreeData () {
      return [
        {
          id: 1,
          name: this.$t('monitoring.basic'),
          children: []
        },
        {
          id: 2,
          name: this.$t('monitoring.clientData'),
          children: []
        },
        {
          id: 3,
          name: this.$t('monitoring.technical'),
          children: []
        },
        {
          id: 4,
          name: this.$t('social.form'),
          children: []
        },
        {
          id: 5,
          name: this.$t('social.instagram'),
          children: []
        },
        {
          id: 6,
          name: this.$t('social.facebook'),
          children: []
        },
        {
          id: 7,
          name: this.$t('social.google'),
          children: []
        },
        {
          id: 8,
          name: this.$t('social.linkedin'),
          children: []
        },
        {
          id: 9,
          name: this.$t('social.twitter'),
          children: []
        },
        {
          id: 10,
          name: this.$t('monitoring.briteVerify'),
          children: []
        }
      ]
    },
    setTreeData () {
      const treeData = this.getInitialTreeData()
      const treeSelectedValues = []

      this.allowedHeaders.map((header, index) => {
        if (header.parentId) {
          const item = {
            id: `${header.parentId} - ${index}`,
            name: header.text
          }
          treeData[header.parentId - 1].children.push(item)
          if (header.selected) {
            treeSelectedValues.push(item.id)
          }
          header.treeId = `${header.parentId} - ${index}`
        }
        return header
      })

      this.$set(this, 'treeData', treeData)
      this.$set(this, 'treeSelectedValues', treeSelectedValues)
    },
    recognizedOS (os) {
      if (['apple', 'android', 'windows'].includes(os)) {
        return true
      }
    },
    onDeleteVisitorClick (item) {
      this.$refs.confirmDialog.open(
        this.$t('general.confirmTitle', { name: this.$t('wifi.visitor') }), this.$t('general.deleteConfirmMessage'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.loading = true
          this.deleteVisitor({
            nodeId: this.nodeId,
            visitorId: item.id
          }).then(response => {
            global.toastr['success'](this.$t('v2.visitor.visitorDeleteSuccess'), this.$t('general.success'))
            this.fetchVisitors()
            this.loading = false
          })

          EventTracker.sendEvent(EVENT_NAMES.VISITOR_DELETED)
        }
      })
    }
  },
  watch: {
    nodeId (newValue, oldValue) {
      this.pagination = {
        descending: false,
        page: 1,
        rowsPerPage: 20,
        sortBy: 'registration_datetime',
        ordering: 'registration_datetime'
      }
      if (!this.search) {
        this.fetchVisitors()
      } else {
        this.search = ''
      }
    },
    selectedNode: {
      handler: function (newValue, oldValue) {
        if (newValue.id && newValue.id !== oldValue.id && !_.isEmpty(this.userActions)) {
          this.setAllowedHeaders()
          this.setTreeData()
        }
      },
      immediate: true
    },
    userActions: {
      handler: function (newValue) {
        if (!_.isEmpty(newValue) && this.selectedNode.id) {
          this.setAllowedHeaders()
          this.setTreeData()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
