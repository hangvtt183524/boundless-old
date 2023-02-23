<template lang="pug">
  div
    // demo button opening the guestWifiConfigurationModal
    v-btn.mb-5(color='primary', @click='guestWifiConfigurationModal = true')
      | {{ $t('wifi.guestWifiConfiguration') }} (demo)

    // guestWifiConfigurationModal
    v-dialog(v-model='guestWifiConfigurationModal', max-width='900')
      v-card.pa-3
        v-layout(row)
          v-flex(xs10)
            v-card-title.headline {{ $t('wifi.guestWifiConfiguration') }}
          v-flex.text-xs-right(xs2 white)
            v-btn.mt-3(fab, flat, small, @click.native='guestWifiConfigurationModal = false')
              v-icon(small) close
        v-divider

        v-layout.py-4(row)
          v-flex(xs12)
            p {{ $t('etc.loremShort') }}
        v-layout.py-4(row)
          v-flex.px-1(xs6)
            v-text-field(:label="$t('wifi.wifiAccessName')")
          v-flex.px-1(xs6)
            v-text-field(:label="$t('wifi.wifiAccessName')", append-icon="help")

        v-layout.py-4(row)
          v-flex.px-1(xs12)
            h4 {{ $t('wifi.connectionRules') }}
        v-layout.py-4(row)
          v-flex.px-1(xs6)
            v-select(:items='collection', :label="$t('general.select')")
            v-select(:items='collection', :label="$t('general.select')")
          v-flex.px-1(xs6)
            v-select(:items='collection', :label="$t('general.select')")

        v-layout.py-4(row)
          v-flex.px-1(xs12)
            h4 {{ $t('wifi.wifiActivation') }}
        v-layout.py-4(row)
          v-flex.px-1(xs12)
            // start wifi programming table
            v-data-table.elevation-1(:headers='headers', :items='rows', hide-actions='')
              template(slot='items', slot-scope='props')
                tr
                  td {{ props.item.day }}
                  td {{ props.item.status }}
                  td
                    v-text-field(v-model="props.item.minimum")
                  td
                    v-text-field(v-model="props.item.maximum")
                  td
                    v-slider(v-model="props.item.maximum", min="0" max="24", thumb-label, ticks)

        v-card-actions
          v-btn(color='grey', flat, @click.native='guestWifiConfigurationModal = false') {{ $t('general.close') }}
</template>

<script>
export default {
  name: 'GuestWifiConfiguration',

  data () {
    return {
      guestWifiConfigurationModal: false,
      collection: ['a', 'b'],
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
      ]
    }
  }
}
</script>
