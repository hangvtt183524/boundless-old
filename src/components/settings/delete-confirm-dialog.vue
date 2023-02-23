<template lang="pug">
  v-dialog.base-dialog(
    v-model="dialog"
    :max-width="options.width"
    @keydown.esc="cancel()"
    @close="cancel"
    @input="cancel"
    content-class="organization-confirm-delete"
  )
    .confirm-delete(data-test="confirm-delete")
      v-icon.close-modal(@click.stop="cancel()") close
      h2.dialog-heading(v-show="title") {{ title }}
      h4.dialog-subtitle {{ $t('general.typeFollowingSentenceText') }}
      .suggest-text
        p.pre-wrap {{ options.confirmText }}
      .confirm-text-label {{ $t('general.confirmTextLabel') }}
      v-text-field.transparent(
        data-test="confirm-text"
        v-model="confirmationText"
        :placeholder="$t('general.typeDeletePlaceholder')"
        solo-inverted
      )
      base-button.base-button--danger(
        data-test="btn-delete"
        :disabled="!matchesResponse"
        @click="agree()"
      ) {{ options.deleteButtonText }}
</template>

<script>
import BaseButton from '@/components/v2/base-button/base-button'

export default {
  components: {
    BaseButton
  },
  data () {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      title: null,
      options: {
        color: 'primary',
        width: 290,
        confirmText: '',
        successMessage: '',
        deleteButtonText: ''
      },
      confirmationText: ''
    }
  },
  methods: {
    open (title, options) {
      this.dialog = true
      this.title = title
      this.options = Object.assign({}, this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree () {
      this.dialog = false
      this.resolve(true)
      if (this.options.successMessage) {
        global.toastr['success'](this.options.successMessage, this.$t('general.success'))
      }
    },
    cancel () {
      this.resolve(false)
      this.dialog = false
      this.confirmationText = ''
    }
  },
  computed: {
    matchesResponse () {
      return this.options.confirmText.toLowerCase() === this.confirmationText.toLowerCase()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .confirm-delete {
    .dialog-heading {
      font-size: 30px;
      font-weight: normal;
    }
    .dialog-subtitle {
      margin-top: 43px;
      font-weight: normal;
      font-size: 16px;
      line-height: 25px;
      color: $text-medium;
    }
    .suggest-text {
      padding: 4px 12px;
      background: $gray-xlight;

      p {
        margin: 0;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 26px;

        display: flex;
        align-items: center;

        color: #223D70;
      }
    }
    .confirm-text-label {
      margin-top: 28px;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: $text-medium;
    }
    .transparent {
      padding-top: 0 !important;
    }
    .base-button--danger {
      padding: 0 34px;
      margin-bottom: 12px;
    }
  }
</style>
