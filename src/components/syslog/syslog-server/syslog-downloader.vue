<template lang="pug">
  .syslog-downloader
    base-switch.syslog-downloader__dates-switch(
      v-model="isAllDatesSelected"
      @input="onAllDatesSwitchInput"
      :yes-label="$t('v2.syslog.allDates')"
      :no-label="$t('v2.syslog.customDates')"
    )

    .syslog-downloader__date-pickers(
      v-show="!isAllDatesSelected"
    )
      date-picker.syslog-downloader__date-picker.date-picker--small(
        v-model="startDate"
        :placeholder="$t('general.startDate')"
        :format="dateFormat"
        :max-date="endDate"
      )

      date-picker.syslog-downloader__date-picker.date-picker--small(
        v-model="endDate"
        :placeholder="$t('general.endDate')"
        :format="dateFormat"
        :min-date="startDate"
        :max-date="today"
      )

    base-button.syslog-downloader__download-button.base-button--blue(
      @click="onDownloadClick"
      :loading="downloading"
    )
      | {{ $t('general.download') }}

</template>

<script>
import { mapActions } from 'vuex'
import DatePicker from '@/components/v2/date-picker/date-picker'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseButton from '../../v2/base-button/base-button'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import multiDownload from 'multi-download'

export default {
  name: 'syslog-downloader',
  components: {
    BaseButton,
    DatePicker,
    BaseSwitch
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    server: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      isAllDatesSelected: true,
      startDate: null,
      endDate: null,
      downloading: false,
      dateFormat: 'YYYY-MM-DD'
    }
  },
  computed: {
    today () {
      return this.$moment().format(this.dateFormat)
    }
  },
  methods: {
    ...mapActions('workspace/syslog', ['getSyslogFileUrls']),
    onAllDatesSwitchInput () {
      if (!this.isAllDatesSelected) {
        // On switch to custom dates, initialize date range for last week if not selected
        if (!(this.startDate && this.endDate)) {
          this.startDate = this.$moment().subtract(7, 'd').format(this.dateFormat)
          this.endDate = this.$moment().format(this.dateFormat)
        }
      }
    },
    onDownloadClick () {
      const filters = {
        workspaceId: this.workspaceId,
        id: this.server.id
      }

      // Set date filters, if provided
      if (!this.isAllDatesSelected) {
        if (this.startDate) {
          filters.start_date = this.startDate
        }

        if (this.endDate) {
          filters.end_date = this.endDate
        }
      }

      this.downloading = true
      this.getSyslogFileUrls(filters).then(response => {
        multiDownload(response.data.data.results)
        this.downloading = false

        if (response.data.data.results.length === 0) {
          global.toastr['error'](this.$t('v2.syslog.noFilesToDownload'), this.$t('general.error'))
        }
      }).catch(() => {
        global.toastr['error'](this.$t('v2.syslog.downloadFailure'), this.$t('general.error'))
        this.downloading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .syslog-downloader {
    &__dates-switch {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 20px;
    }

    &__date-pickers {
      display: inline-block;
      width: 340px;
      margin-bottom: 20px;
    }

    &__date-picker {
      display: inline-block;
      margin-right: 20px;
      width: 150px;
    }

    &__download-button {
      width: 160px;
    }
  }

</style>
