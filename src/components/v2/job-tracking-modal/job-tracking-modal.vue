<template lang="pug">
  base-modal(
    class="job-tracking-modal"
    :show="show"
    @close="close"
    max-width="520px"
    :persistent="persistent"
  )
    template(v-slot:default)
      .job-tracking-modal__content
        .progress(v-if="status === jobStatuses.pending || status === jobStatuses.running")
          .progress__title(
            v-html="title"
          )
          .progress__icon-container
            v-progress-circular.progress__icon-container__icon(
              :size="50"
              indeterminate color="#15ac2f"
            )
          .progress__description
            | {{ text }}
          .progress__info(
            v-if="progressInfo"
          )
            | {{ $t(`v2.longRunningJob.events.${progressInfo.code}`) }}
            span(
              v-if="progressInfo.extra_info"
              v-html="getFormattedMessageExtraInfo(progressInfo)"
            )

        .post-run-messages(v-if="isFinished && displayPostRunMessages && postRunMessages.length > 0")
          .post-run-messages__title
            | {{ title }}
          .post-run-messages__description
            | {{ $t('v2.longRunningJob.jobMessagesDescription') }}

          ul
            li.post-run-messages__message(
              v-for="(message, index) of postRunMessages"
              :key="index"
              :class="[{'post-run-messages__message--error': errors.indexOf(message) > -1}, {'post-run-messages__message--warning': warnings.indexOf(message) > -1}]"
            )
              span(
                v-html="$t(`v2.longRunningJob.events.${message.code}`)"
              )
              span(
                v-if="message.extra_info"
                v-html="getFormattedMessageExtraInfo(message)"
              )
              .post-run-messages__message(
                v-if="message.text"
                v-html="$t(`v2.longRunningJob.errorText`) + message.text"
              )

    template(v-slot:footer)
      div.job-tracking-modal__footer(
        v-if="(!persistent || dismissible || isFinished) && !closing"
      )
        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green--negative"
              @click="close"
            ) {{ isFinished ? $t('general.close') : $t('general.hide') }}
            div.job-tracking-modal__footer__dismiss-info(
              v-if="dismissible && !isFinished && dismissInfo"
            ) {{ dismissInfo }}

</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import { mapActions } from 'vuex'

export default {
  name: 'job-tracking-modal',
  components: {
    BaseModal,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    persistent: {
      type: Boolean,
      default: false
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    displayPostRunMessages: {
      type: Boolean,
      default: false
    },
    dismissInfo: {
      type: String,
      required: false
    },
    suppressDefaultMessages: {
      type: Boolean,
      default: false
    },
    statusCheckInterval: {
      type: Number,
      default: 2000
    },
    messageInfoFormatter: {
      type: Function,
      required: false
    },
    ignoreWarningsForStatus: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      jobStatuses: {
        pending: 'pending',
        running: 'running',
        successful: 'successful',
        failed: 'failed'
      },
      jobId: null,
      progressInfo: null,
      status: 'pending',
      title: null,
      text: null,
      show: false,
      closing: false,
      errors: [],
      warnings: [],
      successMessage: null
    }
  },
  computed: {
    isFinished () {
      return this.status === this.jobStatuses.successful || this.status === this.jobStatuses.failed
    },
    postRunMessages () {
      return this.warnings.concat(this.errors)
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchLongRunningJob']),
    open (jobId, title, text, successMessage) {
      this.jobId = jobId
      this.title = title
      this.text = text
      this.successMessage = successMessage

      // Reset state
      this.resetState()

      this.show = true

      // Start tracking job
      this.trackJob()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    resetState () {
      this.progressInfo = null
      this.status = 'pending'
      this.errors = []
      this.warnings = []
      this.closing = false
    },
    trackJob () {
      const jobData = {
        workspaceId: this.workspaceId,
        jobId: this.jobId
      }

      this.fetchLongRunningJob(jobData).then(response => {
        const jobData = response.data.data

        this.status = jobData.status

        if (jobData.status === this.jobStatuses.successful || jobData.status === this.jobStatuses.failed) {
          this.onJobFinish(jobData)
        } else if (jobData.status === this.jobStatuses.pending || jobData.status === this.jobStatuses.running) {
          // Set progress info, if any
          this.progressInfo = jobData.events.filter(event => {
            return event.type === 'info'
          }).slice(-1)[0]

          // Job still not complete, re-run this method in 2 seconds
          setTimeout(this.trackJob.bind(this), this.statusCheckInterval)
        }
      }).catch(() => {
        if (!this.suppressDefaultMessages) {
          global.toastr['error'](this.$t('v2.longRunningJob.jobFailed'), this.$t('general.error'))
        }

        this.status = this.jobStatuses.failed
        this.close(false)
      })
    },
    onJobFinish (jobData) {
      // Show post-run message
      const isSuccess = jobData.status === this.jobStatuses.successful
      if (!this.suppressDefaultMessages) {
        if (isSuccess) {
          global.toastr['success'](this.$t('v2.longRunningJob.jobSuccess'), this.$t('general.success'))
        } else {
          global.toastr['error'](this.$t('v2.longRunningJob.jobFailed'), this.$t('general.error'))
        }
      }

      if (this.displayPostRunMessages) {
        // Set post-run event list, filtering out errors without a valid translation
        this.errors = jobData.events.filter(event => {
          return event.type === 'error' && this.$te('v2.longRunningJob.events.' + event.code)
        })

        this.warnings = jobData.events.filter(event => {
          return event.type === 'warning' && this.$te('v2.longRunningJob.events.' + event.code)
        })

        if (this.postRunMessages.length === 0) {
          this.close(isSuccess)
        }
      } else {
        this.close(isSuccess)
      }
    },
    getFormattedMessageExtraInfo (message) {
      if (this.messageInfoFormatter) {
        return this.messageInfoFormatter(message)
      }

      return message.extra_info
    },
    close (result) {
      if (result === undefined) {
        // If not result provided, use job result
        result = this.status === this.jobStatuses.successful &&
          (this.ignoreWarningsForStatus || this.warnings.length === 0)
      }

      this.closing = true
      this.resolve(result)

      this.show = false
    }
  }
}
</script>

<style src="./job-tracking-modal.scss" lang="scss" scoped></style>
