<template lang="pug">
  .network-creation-flow-execution-summary
    .network-creation-flow-execution-summary__parameter
      v-layout(row wrap)
        v-flex(xs12)
          label {{ $t('v2.merakiTemplates.targets') }}
          span {{ targetNames }}

    label
      | {{ $t('v2.merakiNetworkCreation.executionSummary') }}
      span.download-link(
        @click="onDownloadLinkClick"
      ) {{ $t('v2.merakiNetworkCreation.downloadInputFile') }}

    ul.network-creation-flow-execution-summary__events
      li.network-creation-flow-execution-summary__events__event(
        v-for="(event, index) of events"
        :key="index"
      )
        v-layout(row wrap)
          v-flex.network-creation-flow-execution-summary__events__event__label(xs5 md3 lg3 xl2)
            | {{ $t(`v2.merakiNetworkCreation.events.${event.code}`) }}
            span(
              v-if="event.extra_info"
            ) :
          v-flex(xs5 md3 lg2 xl1)
            span(
              v-if="event.extra_info"
            )
              | {{ event.extra_info }}
</template>

<script>
import { mapActions } from 'vuex'
import Sortable from 'sortablejs/modular/sortable.complete.esm'

export default {
  name: 'network-creation-flow-execution-summary',
  props: {
    execution: {
      type: Object,
      required: true
    },
    workspaceId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      events: [],
      jobStatuses: {
        pending: 'pending',
        running: 'running',
        successful: 'successful',
        failed: 'failed'
      },
      status: 'pending'
    }
  },
  mounted () {
    // Start tracking job
    this.trackJob()
  },
  computed: {
    targetNames () {
      return this.execution.targets.map(target => {
        return target.name
      }).join(', ')
    }
  },
  watch: {
    isExistingFlow: {
      handler: function () {
        if (this.isExistingFlow && !this.isExecuted) {
          // Initialize sortable functionality of steps
          window.setTimeout(function () {
            Sortable.create(
              this.$refs.stepList,
              {
                draggable: '.dynamic-step',
                handle: '.drag-handle',
                onEnd: this.onDragSortEnd
              }
            )
          }.bind(this), 100)
        }
      }
    },
    isExecuted: {
      handler: function (newValue, oldValue) {
        if (!oldValue && newValue) {
          // Switching to executed state, open executions tab
          this.selectedTab = this.tabs.executions
        }
      }
    },
    execution: {
      handler: function (newValue) {
        this.events = []

        if (newValue) {
          this.trackJob()
        }
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchLongRunningJob']),
    trackJob () {
      const jobData = {
        workspaceId: this.workspaceId,
        jobId: this.execution.job.id
      }

      this.fetchLongRunningJob(jobData).then(response => {
        const jobData = response.data.data

        // Set events list
        this.$set(this, 'events', jobData.events)

        if (this.status === this.jobStatuses.running) {
          // If status goes to a terminal state from running state, display execution result message
          if (jobData.status === this.jobStatuses.successful) {
            global.toastr['success'](this.$t('v2.merakiNetworkCreation.executionSuccess'), this.$t('general.success'))
          } else if (jobData.status === this.jobStatuses.failed) {
            global.toastr['error'](this.$t('v2.merakiNetworkCreation.executionFailure'), this.$t('general.error'))
          }
        }

        if (jobData.status === this.jobStatuses.pending || jobData.status === this.jobStatuses.running) {
          // Job still not complete, re-run this method in 2 seconds
          setTimeout(this.trackJob.bind(this), 2000)
        }

        this.$set(this, 'status', jobData.status)
      }).catch(() => {
        global.toastr['error'](this.$t('v2.merakiNetworkCreation.executionFailure'), this.$t('general.error'))
      })
    },
    onDownloadLinkClick () {
      this.$emit('inputFileDownloadClick')
    }
  }
}
</script>

<style src="./network-creation-flow-execution-summary.scss" lang="scss" scoped></style>
