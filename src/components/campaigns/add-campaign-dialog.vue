<template lang='pug'>
  base-dialog(
    :show="show"
    @close="close"
    scrollable
    persistent
  )
    v-stepper(v-model="currentStep")
      v-stepper-items
        v-stepper-content(step="1")
          step-one(
            v-model="campaignData"
            ref="step1"
          )
        v-stepper-content(step="2")
          step-two(
            v-model="campaignData"
            ref="step2"
            :current-step="currentStep",
            :campaign="campaignData",
          )

    v-layout(row wrap pt-3)
      v-flex(xs12)
        v-btn(
          v-show="this.currentStep > 1"
          @click.native="currentStep -= 1"
          color="success"
          large
          outline
          round
        ) {{$t('general.previous')}}

        v-btn(
          :loading="loading"
          :disabled="!isDataValid()"
          @click.native="nextStep"
          color="success"
          large
          round
          style="float: right"
        ) {{ continueBtnLabel }}
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'

import { CAMPAIGN_ADDED_EVENT } from '@/constants/events'

import CurrentUserMixin from '@/mixins/current-user.mixin'

import baseDialog from '@/components/common/base-dialog'
import stepOne from './step-one'
import stepTwo from './step-two'
import ScenarioStub from '@/stubs/scenario'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

const scenarioStub = JSON.parse(JSON.stringify(ScenarioStub))

export default {
  mixins: [
    CurrentUserMixin
  ],
  components: {
    baseDialog,
    stepOne,
    stepTwo
  },
  data () {
    return {
      loading: false,
      currentStep: 1,
      campaignData: {

        // Step 1 properties
        name: '',
        splashpage: null,
        node: null,
        schedule_is_active: false,
        schedule_start_datetime: null,
        schedule_end_datetime: null,

        // For pickers, not sent to api
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,

        // Step 2 properties
        isConditionalRedirect: false,
        redirection_mode: 'static',

        // Step 2 connection mode
        redirection_url_static: '',
        redirection_url_auth_form: '',
        redirection_url_auth_facebook: '',
        redirection_url_auth_twitter: '',
        redirection_url_auth_linkedin: '',
        redirection_url_auth_instagram: '',
        redirection_url_auth_google: '',

        // Step 2 Device/Mobile app
        redirection_url_device_default: '',
        redirection_url_device_apple: '',
        redirection_url_device_android: '',
        redirection_url_device_windows: '',

        // Step 2 Scenario mode
        scenarios: [
          scenarioStub
        ],

        acceptTerms: false,
        site: '',
        summary: ''
      }
    }
  },
  props: ['show'],
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    continueBtnLabel () {
      if (this.currentStep < 2) {
        return this.$t('general.continue')
      } else {
        return this.$t('campaign.saveCampaign')
      }
    },
    scheduleStartDateTime () {
      const dateTime = `${this.campaignData.startDate} ${this.campaignData.startTime}`
      return this.$moment(dateTime, this.dateTimeFormat).toISOString()
    },
    scheduleEndDateTime () {
      const dateTime = `${this.campaignData.endDate} ${this.campaignData.endTime}`
      return this.$moment(dateTime, this.dateTimeFormat).toISOString()
    },
    scheduleData () {
      return {
        schedule_start_datetime: this.scheduleStartDateTime,
        schedule_end_datetime: this.scheduleEndDateTime
      }
    }
  },

  validations: {
    campaignData: {
      name: {
        required,
        maxLength: maxLength(32)
      },
      splashpage: {
        required
      },
      startDate: {
        required
      },
      endDate: {
        required
      },
      startTime: {
        required
      },
      endTime: {
        required
      }
    }
  },

  methods: {
    ...mapActions('organization/campaign', ['createCampaign']),
    close () {
      this.$emit('close')
      const scenario = JSON.parse(JSON.stringify(ScenarioStub))
      Object.assign(this.$data, this.$options.data.apply(this))
      this.$set(this.campaignData, 'scenarios', [scenario])
      this.$set(this.campaignData, 'node', this.selectedOrganization.id)
    },
    saveCampaign () {
      this.loading = true
      this.campaignData.orgId = this.selectedOrganization.id

      if (this.campaignData.schedule_is_active) {
        this.campaignData = Object.assign(
          {}, this.campaignData, this.scheduleData
        )
      }
      this.createCampaign(this.campaignData).then(response => {
        this.close()
        this.$eventHub.$emit(CAMPAIGN_ADDED_EVENT)
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CAMPAIGN_CREATED)
    },
    nextStep () {
      if (this.currentStep === 2) {
        this.saveCampaign()
      } else {
        this.currentStep += 1
      }
    },
    isDataValid () {
      if (this.currentStep === 1) {
        let valid = !(this.$v.campaignData.name.$invalid || this.$v.campaignData.splashpage.$invalid)
        if (this.campaignData.schedule_is_active) {
          const fields = [
            'startDate',
            'endDate',
            'startTime',
            'endTime'
          ]
          for (let field of fields) {
            if (this.$v.campaignData[field].$invalid) {
              return false
            }
          }
        }
        return valid
      } else if (this.currentStep === 2 && this.$refs.step2) {
        return this.$refs.step2.isValid()
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="sass">
  .item-list
    display: flex
    flex-wrap: wrap
    align-items: center
    margin: 20px 10px
    .item
      padding: 10px 20px
      text-align: center
      background-color: #F2F2F2
      color: gray
      font-size: 13px
      border-radius: 3px
      margin: 5px
      flex: 1
      max-width: 30%
      min-width: 15%
      cursor: pointer
      border: 1px solid #d9d9d9
      &.active
        background-color: #ffffff
      .v-icon
        margin-top: 15px
        height: 30px
      p
        height: 30px
        font-size: 12px
        line-height: 1.2
        margin-top: 10px
</style>
