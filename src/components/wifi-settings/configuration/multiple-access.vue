<template lang="pug">
  v-container(grid-list-md)
    // top paragraph
    v-layout
      v-flex(xs12, sm12, md6, lg6)
        h2 {{ $t(' wifi.generateCodes ') }}
      v-flex.pb-3(xs6, md6, lg6, text-xs-right)
        v-btn.primary-action(color='primary')
          | {{ $t('general.save') }}
          v-icon save

    // assignGeneralRestrictions row
    v-layout.pt-5(row)
      v-flex(xs12)
        h4
          | {{ $t('wifi.assignGeneralRestrictions') }}

    v-layout(row)
      v-flex(xs12, sm6)
        v-select(:items='connectionTimeOptions', v-model='connectionTimeOptionModel', :label="$t('wifi.wifiProgramming')", single-line)

      v-flex(xs12, sm6)
        v-select(:items='connectionTimeOptions', v-model='connectionTimeOptionModel', :label="$t('wifi.duration')", single-line)

    // createNewWifiAccess row
    v-layout.pt-5(row)
      v-flex(xs12)
        h4
          | {{ $t('wifi.createNewWifiAccess') }}

    v-layout(row)
      v-flex(xs12, sm6)
        v-text-field(:label="$t('wifi.accessNumber')")
        v-select(:items='connectionTimeOptions', v-model='connectionTimeOptionModel', :label="$t('wifi.duration')", single-line)

      v-flex(xs12, sm6)
        v-layout(row)
          v-flex(xs12, sm5)
            date-picker(
              v-model="wifiStartDate"
              :label="$t('general.startDate')"
            )
          v-flex(xs12, offset-sm2, sm5)
            date-picker(
              v-model="wifiEndDate"
              :label="$t('general.endDate')"
            )
        v-layout(row)
          v-flex(xs12, sm5)
            time-picker(
              v-model="wifiStartTime"
              :label="$t('general.startTime')"
            )
          v-flex(xs12, offset-sm2, sm5)
            time-picker(
              v-model="wifiEndTime"
              :label="$t('general.endTime')"
            )

    // export buttons
    v-layout(row)
      v-flex(xs12, sm6)
        v-btn(block, color='secondary', dark) {{ $t('wifi.exportInCSV') }}
      v-flex(xs12, sm6)
        v-btn(block, color='secondary', dark) {{ $t('wifi.exportInXLS') }}

    // wifi programming top
    v-layout(row)
      v-flex.py-5(xs12 sm4)
        h1 {{ $t('organization.wifiProgramming') }}
      v-flex.py-5(xs4 sm1)
        | {{ $t('general.yes') }}
      v-flex.py-5(xs4 sm1)
        v-switch(v-model="switch1", color="success")
      v-flex.py-5(xs4 sm1)
        | {{ $t('general.no') }}

    // start wifi programming table
    v-layout(row)
      v-flex(xs12)
        v-data-table.elevation-1(:headers='headers', :items='rows')
          template(slot='items', slot-scope='props')
            td {{ props.item.day }}
            td {{ props.item.status }}
            td
              v-text-field(v-model="props.item.minimum")
            td
              v-text-field(v-model="props.item.maximum")
            td
              v-slider(v-model="props.item.maximum", min="0" max="24", thumb-label, ticks)

</template>

<script>
import DatePicker from '@/components/common/date-picker'
import TimePicker from '@/components/common/time-picker'

export default {
  name: 'WifiConfigurationMultipleAccess',

  components: {
    DatePicker,
    TimePicker
  },
  data () {
    return {
      wifiStartDate: '',
      wifiEndDate: '',
      wifiStartTime: '',
      wifiEndTime: '',
      switch1: false,
      headers: [
        { text: this.$t('general.day'), value: 'day', sortable: false, width: 100 },
        { text: this.$t('general.status'), value: 'status', sortable: false, width: 100 },
        { text: this.$t('general.from'), value: 'minimum', sortable: false, width: 100 },
        { text: this.$t('general.to'), value: 'maximum', sortable: false, width: 100 },
        { text: '', value: 'edit', sortable: false }
      ],
      rows: [
        { day: this.$t('general.days.monday'), status: this.$t('general.active'), minimum: 0, maximum: 16, edit: '' },
        { day: this.$t('general.days.tuesday'), status: this.$t('general.active'), minimum: 0, maximum: 24, edit: '' },
        { day: this.$t('general.days.wednesday'), status: this.$t('general.active'), minimum: 0, maximum: 20, edit: '' },
        { day: this.$t('general.days.thursday'), status: this.$t('general.active'), minimum: 0, maximum: 16, edit: '' },
        { day: this.$t('general.days.friday'), status: this.$t('general.active'), minimum: 0, maximum: 16, edit: '' },
        { day: this.$t('general.days.saturday'), status: this.$t('general.active'), minimum: 0, maximum: 16, edit: '' },
        { day: this.$t('general.days.sunday'), status: this.$t('general.active'), minimum: 0, maximum: 16, edit: '' }
      ],
      connectionTimeOptionModel: '',
      connectionTimeOptions: [
        { text: '30 min' },
        { text: '1 hr' },
        { text: '12 hr' },
        { text: '24 hr' },
        { text: '7 d' },
        { text: '30 d' }
      ]
    }
  },

  methods: {}
}
</script>
