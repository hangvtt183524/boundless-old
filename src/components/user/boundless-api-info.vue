<template lang="pug">
  panel-container(:title="`Boundless ${$t('general.apiKey')}`" data-test="boundless-api-info")
    v-layout(row pt-2)
      v-flex(:class="clipBoardBtnClass" v-if="formData.boundless_api_key")
        span.d-inline-block
          v-btn.btn-copy-board(icon @click="copyToClipboard" data-test="btn-copy-board")
            v-icon file_copy
      v-flex(xs12 px-3 v-if="hasKey")
        v-text-field.boundless-api-key(
          data-test="boundless-api-key"
          :append-icon="deleteIcon"
          :append-icon-cb="showDeleteDialog"
          :hint="hint"
          @click="copyToClipboard"
          :label="$t('general.apiKey')"
          placeholder="--"
          persistent-hint
          readonly
          v-model="formData.boundless_api_key"
        )
      v-flex(:class="generateBtnContainerClass")
        v-btn.btn-key-generate(
          data-test="btn-key-generate"
          :class="generateBtnClass"
          :loading="isLoading"
          @click="onGenerateClick"
          color="primary"
          round
        ) {{ $t('general.generateNewKey') }}

    confirm-dialog(ref="confirmDialog")
</template>

<script>
import { mapActions } from 'vuex'

import ConfirmDialog from '@/components/common/confirm-dialog'
import PanelContainer from '@/components/common/panel-container'

import CurrentUserMixin from '@/mixins/current-user.mixin'

export default {
  name: 'BoundlessApiInfo',
  components: {
    ConfirmDialog,
    PanelContainer
  },
  mixins: [
    CurrentUserMixin
  ],
  data () {
    return {
      formData: {
        boundless_api_key: ''
      },
      hint: '',
      isLoading: false
    }
  },
  mounted () {
    this.setFormData()
  },
  computed: {
    hasKey () {
      return Boolean(this.formData.boundless_api_key)
    },
    deleteIcon () {
      return this.hasKey ? 'close' : null
    },
    generateBtnContainerClass () {
      return {
        'x1': this.hasKey,
        'xs12': !this.hasKey,
        'pt-2': this.hasKey,
        'pb-3': !this.hasKey,
        'pt-1': !this.hasKey,
        'px-5': !this.hasKey
      }
    },
    clipBoardBtnClass () {
      return {
        'x1': this.hasKey,
        'xs12': !this.hasKey,
        'pt-2': this.hasKey,
        'pb-3': !this.hasKey,
        'pt-1': !this.hasKey,
        'px-5': !this.hasKey
      }
    },
    generateBtnClass () {
      return {
        'btn--small': this.hasKey,
        'btn--large': !this.hasKey,
        'btn--block': !this.hasKey
      }
    }
  },
  methods: {
    ...mapActions('user', ['deleteBoundlessKey', 'generateBoundlessKey']),
    setFormData () {
      this.$set(this.formData, 'boundless_api_key', this.profile.boundless_api_key)
    },
    showDeleteDialog () {
      this.$refs.confirmDialog.open(
        this.$t('general.deleteApiKey'), this.$t('general.confirmDeleteApiKey'), { color: 'error' }
      ).then(confirm => {
        if (confirm) {
          this.deleteKey()
        }
      })
    },
    showConfirmDialog () {
      const message = `${this.$t('general.confirmNewKey')} ${this.$t('general.newKeyEffect')}`
      this.$refs.confirmDialog.open(
        this.$t('general.generateNewKey'), message, { color: 'primary', width: 'auto' }
      ).then(confirm => {
        if (confirm) {
          this.submit()
        }
      })
    },
    onGenerateClick () {
      if (!this.hasKey) {
        this.submit()
      } else {
        this.showConfirmDialog()
      }
    },
    copyToClipboard () {
      if (this.formData.boundless_api_key) {
        this.$copyText(this.formData.boundless_api_key).then(e => {
          this.hint = this.$t('general.copiedToClipboard')
          setTimeout(() => {
            this.hint = ''
          }, 2000)
        })
      }
      if (this.formData.boundless_api_key) {
      }
    },
    deleteKey () {
      this.isLoading = true
      this.deleteBoundlessKey().then(response => {
        this.setFormData()
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    submit () {
      this.isLoading = true
      this.generateBoundlessKey().then(response => {
        this.setFormData()
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    }
  }
}
</script>
