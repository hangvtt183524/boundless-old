<template lang="pug">
  .download-control
    v-menu(
      offset-y
      transition="slide-y-transition"
      :close-on-content-click="false"
      :open-on-click="false"
      bottom
      v-model="openDownloadMenu"
    )
      v-btn(
        slot="activator"
        color="indigo"
        class="white--text"
        @click="showModifyMenu"
      ) {{ $t('general.download')}}
      v-card.download-menu
        v-layout(row, wrap)
          v-flex.mb-1(xs12 sm6)
            date-picker(
              :width="230"
              v-model="startDate"
              :label="$t('general.startDate')"
              :max-date="startMaxDate"
              required
            )
          v-flex.mb-1(xs12 sm6)
            date-picker(
              :width="230"
              v-model="endDate"
              :label="$t('general.endDate')"
              :min-date="endMinDate"
              :max-date="new Date().toISOString()"
              required
            )
        v-layout(row, wrap)
          v-flex.mb-2(xs12)
            .label {{ $t('general.columns') }}
          v-treeview(
            :items="treeData"
            multiple-active
            selectable
            v-model="values"
            v-if="isTree")
          v-flex.mb-1(xs12 sm6 md4 lg3 xl2, v-for="column in exportColumns", v-if="!isTree && column.text && column.text !== 'actions' && column.text !== $t('general.reload')", :key="column.value")
            v-checkbox(:label="column.text", v-model="column.selected", hide-details)
        v-layout(row, wrap)
          v-flex.mb-1(xs12)
            v-select(
              :items="exportTypes"
              :label="$t('general.downloadType')"
              v-model="type"
            )
        v-layout(row, wrap)
          v-flex.mb-1(xs12)
            v-checkbox(
              :label="$t('general.downloadByEmail')"
              v-model="isSendEmail"
            )
          v-flex.mb-1(xs12)
            v-spacer
            v-btn(
              :disabled="disableDownloadBtn()"
              class="white--text"
              color="success"
              round
              @click="onDownload"
            ) {{ $t('general.download') }}
</template>

<script>
import CurrentUserMixin from '@/mixins/current-user.mixin'

import DatePicker from '@/components/common/date-picker'

export default {
  mixins: [
    CurrentUserMixin
  ],
  components: {
    DatePicker
  },
  props: ['columns', 'selectedItems', 'treeData', 'isTree'],
  data () {
    return {
      openDownloadMenu: false,
      startDate: null,
      endDate: null,
      exportColumns: [],
      values: [],
      exportTypes: [
        { text: this.$t('general.downloadToCSV'), value: 'csv' },
        { text: this.$t('general.downloadToXLSX'), value: 'xlsx' }
      ],
      type: 'csv',
      isSendEmail: false
    }
  },
  computed: {
    startMaxDate () {
      if (this.endDate) {
        return this.strToDate(this.endDate).toISOString()
      }
      return null
    },
    endMinDate () {
      if (this.startDate) {
        return this.strToDate(this.startDate).toISOString()
      }
      return new Date().toISOString()
    }
  },
  methods: {
    disableDownloadBtn () {
      for (let i = 0; i < this.exportColumns.length; i++) {
        if (this.exportColumns[i].text && this.exportColumns[i].selected && this.exportColumns[i].text !== 'actions' && this.exportColumns[i].text !== this.$t('general.reload')) return false
      }
      return true
    },
    showModifyMenu () {
      this.openDownloadMenu = !this.openDownloadMenu
      if (this.openDownloadMenu) {
        if (this.isTree) {
          if (this.values && this.values.length) {
            const values = this.values.filter(item => typeof item === 'string')
            this.exportColumns = values.map(item => {
              const column = this.columns.find(col => col.treeId === item)
              return { text: column.text, value: column.value, selected: column.selected }
            })
          }
        } else {
          if (this.columns && this.columns.length) {
            this.exportColumns = Object.assign([], this.columns.map(item => ({ text: item.text, value: item.value, selected: item.selected })))
          }
        }
      }
    },
    onDownload () {
      const fields = `id,${this.exportColumns.filter(item => item.selected && item.value !== 'icon' && item.value !== 'actions').map(item => item.value).toString()}`
      let data = {
        fields,
        type: this.type,
        send_email: this.isSendEmail
      }
      if (this.startDate) {
        data.registration_datetime_after = this.strToDate(this.startDate).format('YYYY-MM-DD')
      }

      if (this.endDate) {
        data.registration_datetime_before = `${this.strToDate(this.endDate).format('YYYY-MM-DD')} 23:59:59`
      }
      this.$emit('download', data)
      this.openDownloadMenu = false
    }
  },
  watch: {
    values (newValue) {
      const values = newValue.filter(item => typeof item === 'string')
      this.exportColumns = values.map(item => {
        const column = this.columns.find(col => col.treeId === item)
        return { text: column.text, value: column.value, selected: true }
      })
    },
    selectedItems (v, oldValue) {
      this.values = v
    },
    startDate (v, oldValue) {
      console.log('start', v, oldValue)
    }
  }
}
</script>
<style lang="scss">
.download-menu {
  padding: 15px !important;
  overflow-x: hidden;
  margin: 0 3px 3px 0px !important;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important;
}
</style>
