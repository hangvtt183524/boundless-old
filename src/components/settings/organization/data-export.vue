<template lang="pug">
  .data-export(data-test="settings-data-export-page")
    v-layout(row wrap)
      v-flex.pa-2.pt-3(xs12 md6)
        ftp-info

      // hide for now #160446724
      v-flex.pa-2(xs12 sm6 v-if="false")
        h3.small-heading.py-3 {{ $t('organization.exportDataCRM') }}
        .form-card
          v-layout(row)
            v-flex(xs6)
              v-select.ml-3(
                :items='providers'
                :label="$t('general.chooseProvider')"
                required
                single-line
                v-model='crm.provider'
              )
          v-layout(row)
            v-flex.text-xs-right(xs12)
              v-btn(
                :disabled="isCrmButtonDisabled"
                color="success"
                large
                round
              ) {{ $t('general.save') }}

</template>

<script>
import FtpInfo from './data-export/ftp-info'

export default {
  name: 'DataExport',

  components: {
    FtpInfo
  },

  data () {
    return {
      crm: {
        provider: ''
      },
      providers: [
        'SalesForce'
      ]
    }
  },

  computed: {
    isCrmButtonDisabled () {
      return !this.crm.provider
    }
  }
}
</script>
