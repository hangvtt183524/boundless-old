<template lang="pug">
  div
    // the guestWifiConfigurationModal
    v-layout(row)
      v-flex(xs4)
        guest-wifi-configuration
      v-flex(xs4)
        guest-wifi-parameters

    // guest wifi table
    v-data-table.elevation-1(:headers='headers', :items='rows')
      template(slot='items', slot-scope='props')
        tr.user-list-table-row()
          td.px-0.text-xs-right
            v-checkbox(v-model='props.item.selected')
          td.px-0.text-xs-right {{ props.item.name }}
          td.px-0.text-xs-right {{ props.item.siteGroup }}
          td.px-0.text-xs-right
            template(v-for='(day, i) in props.item.days', :keys='day') {{ day }}
              template(v-if='i < props.item.days.length - 1') ,&nbsp;
          td.px-0.text-xs-right {{ props.item.hour }}
          td.px-0.text-xs-right {{ props.item.status }}
          td.px-0.justify-center.layout
            div.user-list-table-actions
              v-btn.divider-vert.mx-0(icon, @click.prevent.stop='editItem(props.item)')
                v-icon(small, color='grey') edit
              v-btn.divider-vert.mx-0(icon, @click.prevent.stop='deleteItem')
                v-icon(small, color='grey') delete
              v-btn.divider-vert.mx-0(icon, @click.prevent.stop='moreActions')
                v-icon(small, color='grey') more_horiz
</template>

<script>
import guestWifiConfiguration from './guest-wifi-configuration.vue'
import guestWifiParameters from './guest-wifi-parameters.vue'

export default {
  name: 'WifiSettingsParametersGuest',

  components: {
    guestWifiConfiguration,
    guestWifiParameters
  },

  data () {
    return {
      headers: [
        { value: 'selected', align: 'right', sortable: false, width: 50 },
        { text: this.$t('general.name'), value: 'name', align: 'right', sortable: false },
        { text: this.$t('general.siteGroup'), value: 'siteGroup', align: 'right', sortable: false },
        { text: this.$t('general.dayOrDays'), value: 'dayOrDays', align: 'right', sortable: false },
        { text: this.$t('general.hour'), value: 'hour', align: 'right', sortable: false },
        { text: this.$t('general.status'), value: 'status', align: 'right', sortable: false },
        { text: this.$t('general.actions'), value: 'actions', align: 'right', sortable: false }
      ],
      rows: [
        { selected: false, name: 'Wifi guest 1', siteGroup: 'Etam France', days: ['Mon', 'Tue', 'Thr'], hour: '11am to 6pm', status: 'active' },
        { selected: false, name: 'Wifi guest 1', siteGroup: 'Etam France', days: ['Mon', 'Tue', 'Thr', 'Sat', 'Sun'], hour: '11am to 5pm', status: 'active' },
        { selected: false, name: 'Wifi guest 1', siteGroup: 'Etam France', days: ['Mon', 'Tue', 'Thr', 'Sat'], hour: '7am to 4pm', status: 'inactive' },
        { selected: false, name: 'Wifi guest 1', siteGroup: 'Etam France', days: ['Mon', 'Tue', 'Thr', 'Sat'], hour: '8am to 5pm', status: 'active' },
        { selected: false, name: 'Wifi guest 1', siteGroup: 'Etam France', days: ['Mon', 'Tue', 'Thr', 'Sat'], hour: '8am to 4pm', status: 'inactive' },
        { selected: false, name: 'Wifi guest 1', siteGroup: 'Etam France', days: ['Mon', 'Tue', 'Thr'], hour: '10am to 6pm', status: 'inactive' }
      ]
    }
  },

  mounted () {
    console.log('WifiSettingsParametersGuest')
  },

  methods: {
    editItem (item) {
      console.log('editItem', item)
    },
    deleteItem () {
      console.log('deleteItem')
    },
    moreActions () {
      console.log('moreActions')
    }
  }
}
</script>

<style scoped lang="sass">
  .user-list-table-row
    .user-list-table-actions
      opacity: 0
    &:hover
      .user-list-table-actions
        opacity: 1
</style>
