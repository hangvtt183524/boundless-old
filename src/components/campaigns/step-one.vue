<template lang="pug">
  .step-one
    h2.step-heading.mb-3 {{ $t('campaign.createNewCampaign') }}
    v-layout(row)
      v-flex(xs12)
          v-layout(row)
            v-flex(xs12, sm5)
              node-name-input(
                v-model="value.name"
                :label="$t('campaign.nameOfCampaign')"
                :max-length="32"
                required
              )
            v-flex(xs12, offset-sm2, sm5, class="input-wrap")
              v-autocomplete(
                :items="splashPages"
                :label="$t('campaign.chooseSplashPage')"
                required
                item-text="name"
                item-value="id"
                v-model="value.splashpage"
                @blur="$refs.splashPageSelector.isMenuActive = false"
                ref="splashPageSelector"
              )
          v-layout(row)
            v-flex(xs12, sm5, class="input-wrap")
              node-select(
                :indent-level="0"
                :label="$t('campaign.selectGroup')"
                :node-types="['organization', 'group', 'site']"
                hide-details
                search-enabled
                v-model="value.node"
              )

          v-layout(row v-if="!(getAppFeatures==='production')").mt-4
            v-flex(xs12, sm5)
              h2.step-heading.mb-3 {{ $t('campaign.programMyCampaign') }}
            v-flex(xs12, offset-sm2, sm5).custom-switch
              label.disabled-label {{ $t('general.disabled') }}
              v-switch(
                :label="$t('general.active')"
                v-model="value.schedule_is_active"
                color="deep-purple lighten-2"
                hide-details
              )

          v-layout(row v-if="value.schedule_is_active")
            v-flex(xs12, sm5)
              date-picker(
                v-model="value.startDate"
                :label="$t('campaign.campaignStartDate')"
                required
                :min-date="new Date().toISOString()"
                :max-date="startMaxDate"
              )
            v-flex(xs12, offset-sm2, sm5)
              date-picker(
                v-model="value.endDate"
                :label="$t('campaign.campaignFinishDate')"
                required
                :min-date="endMinDate"
              )
          v-layout(row v-if="value.schedule_is_active")
            v-flex(xs12, sm5)
              time-picker(
                v-model="value.startTime"
                :label="$t('campaign.campaignStartTime')"
                required
                :max-time="startMaxTime"
              )
            v-flex(xs12, offset-sm2, sm5)
              time-picker(
                v-model="value.endTime"
                :label="$t('campaign.campaignFinishTime')"
                required
                :min-time="endMinTime"
              )

          v-layout.mt-3(row v-if="value.schedule_is_active")
            label
              | {{ '* ' + $t('campaign.newCampaignNote') }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import DatePicker from '@/components/common/date-picker'
import TimePicker from '@/components/common/time-picker'
import NodeSelect from '@/components/common/node-select'

import CampaignScheduleMixin from '@/mixins/campaign-schedule.mixin'
import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'

export default {
  props: ['value'],
  data () {
    return {
      devices: []
    }
  },
  mixins: [
    CampaignScheduleMixin,
    ManageableNodesMixin
  ],
  components: {
    DatePicker,
    NodeSelect,
    TimePicker
  },
  mounted () {
    this.fetchSplashPages({ orgId: this.orgId, published: 'True', page_size: 0 })
    this.$set(this.value, 'node', this.orgId)
  },
  computed: {
    ...mapGetters('organization', ['splashPages']),
    orgId () {
      return this.$route.params.orgId
    },
    getAppFeatures: function () {
      return process.env.VUE_APP_FEATURES
    }
  },
  methods: {
    ...mapActions('organization', ['fetchSplashPages'])
  },
  watch: {
    orgId (newId) {
      this.fetchSplashPages({ orgId: newId, published: 'True' })
      this.$set(this.value, 'node', newId)
    }
  }
}
</script>

<style lang="scss">
  .custom-switch {
    display: flex;
    align-items: center;
    .disabled-label {
      color: #6e7072;
      font-size: 16px;
      margin-right: 14px;
    }
  }
  .condition-text {
    position: absolute;
    bottom: 5px;
  }
</style>
