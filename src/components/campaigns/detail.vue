<template lang="pug">
  .page-content
    v-layout.pb-4
      v-flex
        h2 {{ $t('general.campaignDetails') }}
      v-flex(
        v-if="hasPermission('campaigns__edit', organizationId)"
        text-xs-right
      )
        v-btn.primary-action(
          color='primary'
          :disabled="!isValid() || !valueChanged"
          :loading="isLoading"
          @click="submit"
        )
          | {{ $t('general.save') }}
          v-icon save

    v-layout(row wrap)
      v-flex.pa-2.pt-3(xs12 md6)
        campaign-info(
          ref="campaignInfo"
          v-model="campaign"
          :readonly="!hasPermission('campaigns__edit', organizationId)"
          @reset="resetCampaign"
        )

    v-layout(row wrap)
      v-flex.pa-2.pt-3(xs12 md6)
        campaign-redirection(
          ref="campaignRedirection"
          v-model="campaign"
          :readonly="!hasPermission('campaigns__edit', organizationId)"
          @reset="resetCampaign"
        )

</template>
<script>
import { mapActions, mapGetters } from 'vuex'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import CampaignInfo from './campaign-info'
import CampaignRedirection from './campaign-redirection'

import ScenarioStub from '@/stubs/scenario'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

const scenarioStub = JSON.parse(JSON.stringify(ScenarioStub))

export default {
  props: {
    campaignId: {
      type: [Number, String],
      required: true
    }
  },
  mixins: [
    CurrentUserMixin,
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    CampaignInfo,
    CampaignRedirection
  },
  mounted () {
    this.fetchCampaignDetails({
      orgId: this.organizationId,
      campaignId: this.campaignId
    }).then(() => {
      this.resetCampaign()
    }).catch(err => {
      if (err.response && err.response.status === 404) {
        this.$router.push({ name: 'error-404' })
      }
    }).finally(() => {
      this.isLoading = false
    })
  },
  data () {
    return {
      isLoading: false,
      campaign: {
        id: null,
        name: '',
        splashpage: null,
        node: null,
        isConditionalRedirect: false
      },
      customKeys: [
        'isConditionalRedirect',
        'scenarios'
      ]
    }
  },
  computed: {
    ...mapGetters('organization/campaign', ['campaignDetails']),
    valueChanged () {
      for (let key of Object.keys(this.campaign)) {
        if (this.campaign[key] !== this.campaignDetails[key]) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    ...mapActions('organization/campaign', ['fetchCampaignDetails', 'updateCampaign']),
    resetCampaign () {
      Object.keys(this.campaign).forEach(key => {
        this.$set(this.campaign, key, this.campaignDetails[key])
      })

      Object.keys(this.campaignDetails).forEach(key => {
        if (key.startsWith('redirection')) {
          this.$set(this.campaign, key, this.campaignDetails[key])
        }
      })

      this.campaign = Object.assign({}, this.campaign, {
        isConditionalRedirect: this.campaignDetails.redirection_mode !== 'static'
      })
      if (this.campaign.redirection_type !== 'scenario') {
        this.$set(this.campaign, 'scenarios', [scenarioStub])
      }
      this.setCustomKeys()
    },
    isValid () {
      const { campaignInfo, campaignRedirection } = this.$refs
      if (campaignInfo && campaignRedirection) {
        return campaignInfo.isValid() && campaignRedirection.isValid()
      }
      return false
    },
    setCustomKeys () {
      for (let key of this.customKeys) {
        this.$set(this.campaignDetails, key, this.campaign[key])
      }
    },
    submit () {
      this.isLoading = true
      const data = {
        ...this.campaign,
        orgId: this.organizationId
      }


      if (!this.campaign.isConditionalRedirect) {
        this.$set(data, 'redirection_mode', 'static')
      }

      this.updateCampaign(data).then(() => {
        this.setCustomKeys()
        this.resetCampaign()
        global.toastr['success'](this.$t('general.dataSaveSuccess'), this.$t('general.success'))
      }).catch(err => {
        this.setErrorData(err)
      }).finally(() => {
        this.isLoading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_MODIFIED)
    }
  }
}
</script>
