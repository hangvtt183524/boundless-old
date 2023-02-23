<template lang="pug">
  .server-info
    .server-info__header
      .server-info__header__title(
        :title="$t('v2.syslog.serverDetails')"
      )
        | {{ $t('v2.syslog.serverDetails') }}

    .server-info__content
      .server-info__content__field
        .server-info__content__field__label
          | {{ $t('v2.syslog.ipAddress') }}:
        .server-info__content__field__value
          | {{ server.ip_address }}

      .server-info__content__field
        .server-info__content__field__label
          | {{ $t('v2.syslog.instanceId') }}:
        .server-info__content__field__value
          | {{ server.instance_id }}

      .server-info__content__field
        .server-info__content__field__label
          | {{ $t('general.status') }}:
        .server-info__content__field__value
          | {{ $t(`v2.syslog.instanceStates.${server.state}`) }}

      .server-info__content__field(
        v-show="server.state === serverStates.active"
      )
        .server-info__content__field__action(
          @click="onDownloadTLSCertificateClick()"
        )
          | {{ $t('v2.syslog.downloadTlsCertificate') }}

</template>

<script>
import { mapActions } from 'vuex'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'server-info',
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
      serverStates: {
        pending: 'pending',
        active: 'active',
        terminating: 'terminating',
        terminated: 'terminated',
        relaunching: 'relaunching'
      }
    }
  },
  methods: {
    ...mapActions('workspace/syslog', ['downloadSyslogServerTLSCertificate']),
    onDownloadTLSCertificateClick () {
      this.downloadSyslogServerTLSCertificate({
        workspaceId: this.workspaceId,
        id: this.server.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .server-info {
    &__header {
      height: 38px;
      line-height: 38px;
      padding: 0 14px;
      background-color: $gray-xlight;
      overflow: hidden;
      position: relative;

      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: $text-dark;

        margin-right: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &__content {
      padding: 0 14px;

      &__field {
        line-height: 36px;
        font-family: Fira Sans;
        font-style: normal;
        font-size: 15px;
        color: $text-medium;

        &__label {
          font-weight: 600;
          margin-right: 5px;
          display: inline;
        }

        &__value {
          display: inline;
        }

        &__action {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;

          text-decoration-line: underline;
          color: $blue-reserve;
          cursor: pointer;
        }
      }
    }
  }
</style>
