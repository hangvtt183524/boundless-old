<template lang="pug">
  .log-activity
    .log-activity__header
      .log-activity__header__info
        span.log-activity__header__info__label
          | {{ $t('v2.syslog.lastLogReceivedOn') }}
        span.log-activity__header__info__value
          | {{ lastLogTime }}
      .log-activity__header__info
        span.log-activity__header__info__label
          | {{ $t('v2.syslog.dailyDataSize') }}
        span.log-activity__header__info__value
          | {{ dailyLogSize }}

      .log-activity__header__actions
        v-icon.log-activity__header__actions__action(
          @click="onLiveSyslogDataToggleClick"
        ) {{tailing ? 'stop' : 'play_arrow'}}

    .log-activity__content
      .log-activity__content__live-logs
        perfect-scrollbar.log-activity__content__live-logs__scroll-area(
          ref="liveLogsScrollHolder"
          @ps-scroll-up="onLiveLogsScrollUp"
        )
          .log-activity__content__live-logs__log-item(
            v-for="log of logs"
          )
            | {{ log }}

</template>

<script>
import { mapActions } from 'vuex'
import { dateTimeFormatter, dataSizeFormatter } from '@/utils/global-cell-formatters'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'log-activity',
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
      tailing: false,
      logs: [],
      dailySyslogActivity: null,
      websocketConnection: null,
      isManuallyScrolled: false
    }
  },
  mounted () {
    this.getDailySyslogActivity()
  },
  beforeDestroy () {
    // Close websocket connection if open
    if (this.websocketConnection) {
      this.websocketConnection.close()
    }
  },
  computed: {
    lastLogTime () {
      return this.dailySyslogActivity ? dateTimeFormatter(this.dailySyslogActivity.last_log_time) : '-'
    },
    dailyLogSize () {
      return this.dailySyslogActivity ? dataSizeFormatter(this.dailySyslogActivity.bytes_received / 1024) : '-'
    }
  },
  methods: {
    ...mapActions('auth', ['createWebsocketConnectionToken']),
    ...mapActions('workspace/syslog', ['getWorkspaceSyslogActivity']),
    getDailySyslogActivity () {
      this.getWorkspaceSyslogActivity({
        workspaceId: this.workspaceId,
        id: this.server.id,
        date: this.$moment().format('YYYY-MM-DD')
      }).then(response => {
        if (response.data.data.results && response.data.data.results.length > 0) {
          this.dailySyslogActivity = response.data.data.results[0]
        }
      })
    },
    shouldAutoScroll () {
      // Determines if we should auto scroll after new logs arrive. If user did not scroll manually, or we are close
      // enough already to the bottom of the live logs box, auto scroll
      const autoScrollThreshold = 80
      const scrollHolder = this.$refs.liveLogsScrollHolder.$el

      return !this.isManuallyScrolled ||
        (scrollHolder.scrollHeight - scrollHolder.scrollTop - scrollHolder.clientHeight < autoScrollThreshold)
    },
    onWebsocketMessageReceive (event) {
      // We'll scroll to bottom as new logs come in, if user is not manually scrolling
      const toScroll = this.shouldAutoScroll()

      const messageData = JSON.parse(event.data)
      this.logs.push(messageData.message)

      if (toScroll) {
        const scrollHolder = this.$refs.liveLogsScrollHolder.$el
        scrollHolder.scrollTop = scrollHolder.scrollHeight
      }
    },
    onLiveSyslogDataToggleClick () {
      if (this.tailing) {
        // Terminate websocket connection
        this.websocketConnection.close()
        this.websocketConnection = null
      } else {
        // Start websocket connection
        this.initiateWebsocketConnection()
      }

      this.tailing = !this.tailing
    },
    initiateWebsocketConnection () {
      // Acquire websocket connection token, and initiate connection
      this.createWebsocketConnectionToken().then(response => {
        const token = response.data.data.token

        this.$connect(`${process.env.VUE_APP_WEBSOCKET_URL}/workspace/${this.workspaceId}/live-syslog/${this.server.id}/client/?token=${token}`)
        this.websocketConnection = this.$socket

        this.websocketConnection.onmessage = this.onWebsocketMessageReceive
      })
    },
    onLiveLogsScrollUp () {
      this.isManuallyScrolled = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .log-activity {
    &__header {
      height: 38px;
      line-height: 38px;

      &__info {
        float: left;
        margin-right: 10px;

        font-family: Fira Sans;
        font-style: normal;
        font-size: 14px;
        color: $text-dark;

        &__label {
          font-weight: 600;
          margin-right: 5px;
        }
      }

      &__actions {
        float: right;

        &__action {
          cursor: pointer;
        }
      }
    }

    &__content {
      &__live-logs {
        margin-top: 20px;
        height: 300px;
        border: 1px solid $gray-light;
        padding: 10px;

        &__log-item {
          line-height: 24px;
          margin-bottom: 5px;
        }

        &__scroll-area {
          height: 100%;
        }
      }
    }
  }
</style>
