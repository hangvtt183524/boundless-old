<template lang="pug">
  base-dialog(
    :show="show"
    @close="close"
    max-width="618"
  )
    h2.dialog-heading.mb-3 {{ $t('wifi.wifiVoucher') }}
    v-layout.edit-wifi-code
      v-flex(xs12)
        v-layout.top-container(row flex-direction-column)
          .title {{ name }}
          .text {{ description }}
        v-layout(row)
          v-flex(sm4 xs5)
            .text {{ $t('venue.venue') }}:
          v-flex(sm8 xs7)
            .value {{ venue }}
        v-layout(row)
          v-flex(sm4 xs5)
            .text {{ $t('wifi.quantityOfVoucher') }}:
          v-flex(sm8 xs7)
            .value {{ quantityOfVouchers }}
        v-layout(row)
          v-flex(sm4 xs5)
            .text {{ $t('wifi.creationDate') }}:
          v-flex(sm8 xs7)
            .value {{ creationDate }}
        v-layout(row)
          v-flex(sm4 xs5)
            .text {{ $t('wifi.dailySchedule') }}:
          v-flex(sm8 xs7)
            .value {{ dailySchedule }}
        v-layout(row)
          v-flex(sm4 xs5)
            .text {{ $t('wifi.forDates') }}:
          v-flex(sm8 xs7)
            .value {{ forDates }}
        v-layout(row v-show="false")
          v-flex(sm4 xs5)
            .text Simultaneous Devices::
          v-flex(sm8 xs7)
            .value {{ simultaneousDevices }}
    v-layout.pt-3.text-xs-right.actions(row)
      v-flex(xs12)
        v-btn(
          v-if="hasPermission('wifi_access_codes__view', selectedNode.id)"
          color="success"
          medium
          outline
          round
          @click.stop='downloadData(1)'
        )
          v-icon fa fa-file-excel
          | {{ $t('tooltip.downloadXLS') }}
        v-btn(
          v-if="hasPermission('wifi_access_codes__view', selectedNode.id)"
          color="success"
          medium
          outline
          round
          @click.stop='downloadData(0)'
        )
          download-csv
          | {{ $t('tooltip.downloadCSV') }}
        v-btn(
          v-if="hasPermission('wifi_access_codes__view', selectedNode.id)"
          color="success"
          medium
          round
          :loading="isLoading"
          @click.stop='viewCodes'
        ) {{ $t('tooltip.view', {name: 'Code List'}) }}
</template>

<script>
import { mapGetters } from 'vuex'
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentUserMixin from '@/mixins/current-user.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import downloadCsv from '@/components/icons/download-csv'
import downloadXls from '@/components/icons/download-xls'

export default {
  mixins: [
    UserPermissionsMixin,
    ErrorHandlerMixin,
    CurrentUserMixin
  ],
  components: {
    downloadCsv,
    downloadXls
  },
  props: {
    wifiCode: {
      type: Object,
      default: () => {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedNode']),
    nodeId () {
      return this.$route.params.nodeId
    }
  },
  data () {
    return {
      name: '',
      description: '',
      venue: '',
      quantityOfVouchers: '',
      creationDate: this.dateFormatter(new Date().toString(), 'YYYY-MM-DD'),
      dailySchedule: this.dateFormatter(new Date().toString(), 'YYYY-MM-DD hh:mm'),
      forDates: this.dateFormatter(new Date().toString(), 'YYYY-MM-DD hh:mm'),
      simultaneousDevices: 'Unlimited',
      isLoading: false
    }
  },
  watch: {
    wifiCode (value, oldValue) {
      if (value) {
        this.name = value.name
        this.description = value.description
        this.venue = value.node_name
        this.quantityOfVouchers = value.code_count
        this.creationDate = this.dateFormatter(value.created_at)
        this.dailySchedule = `${value.validity_window.start_time}  -  ${value.validity_window.end_time}`
        this.forDates = `${this.dateFormatter(value.validity_window.start_date)}  -  ${this.dateFormatter(value.validity_window.end_date)}`
      }
    }
  },
  methods: {
    close (isEdit = false) {
      this.$emit('close', isEdit)
    },
    viewCodes () {
      this.$emit('viewCodes', this.wifiCode)
    },
    downloadData (type) {
      this.$emit('download', this.wifiCode, type)
    }
  }
}
</script>
<style lang="scss">
  .edit-wifi-code {
    .wifi-name {
      color: #354C77;
      font-family: "Fira Sans";
      font-size: 20px;
      font-weight: 600;
      line-height: 25px;
      padding: 10px 0;
    }
    .wifi-email {
      color: #9AA9C4;
      font-family: "Fira Sans";
      font-size: 14px;
      line-height: 18px;
      padding: 10px 0;
    }
    .wifi-phone {
      color: #9AA9C4;
      font-family: "Fira Sans";
      font-size: 14px;
      line-height: 18px;
      padding: 10px 0;
    }

    .wifi-icons {
      font-size: 20px;
      color: #9AA9C4;
    }

    .top-container {
      padding: 15px 0;
      border-bottom: 1px solid #D8DEEB;
      margin-bottom: 18px;
      flex-direction: column;
    }

    .value,
    .text
    {
      color: #354C77;
      font-family:
      "Fira Sans";
      font-size: 14px;
      line-height: 18px;
      padding: 10px 0;
    }
    .title {
        color: #354C77;
        font-family: "Fira Sans";
        font-size: 20px;
        font-weight: 600;
        line-height: 25px;
    }
  }
  .actions {
    .v-btn__content {
      align-items: end;
      i {
        font-size: 18px;
        margin-right: 5px;
      }
    }
    button {
      svg {
        margin-right: 5px;
      }
    }
    .flex {
      @media (max-width: 767px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        button {
          width: 170px;
          &:first-child {
            margin-top: 10px !important;
          }
        }
      }
    }
  }
</style>
