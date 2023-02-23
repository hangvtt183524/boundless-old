// Displays a warning when user tries to leave a page when there are unsaved changes.
// Makes use of "isValueChanged" component field.



let UnsavedLeaveWarningMixin = {

  data: function () {
    return {
      discardChoices: {
        discard: 'discard',
        back: 'back'
      }
    }
  },

  beforeRouteLeave (to, from, next) {
    if (this.isValueChanged) {
      if (this.$refs.discardConfirmModal) {
        // We have discard confirm modal in the component, use it
        // Show confirmation modal if user tries to leave the page when they have changes made
        this.$refs.discardConfirmModal.open().then(discardChoice => {
          if (discardChoice === this.discardChoices.discard) {
            next()
          }

          // Stay in the page
        })
      } else {
        // We do not have discard confirm modal in the component, use browser confirm dialog
        if (confirm(this.$t('general.discardConfirmText'))) {
          next()
        }

        // Stay in the page
      }
    } else {
      return next()
    }
  },

  created () {
    window.addEventListener('beforeunload', this.beforeWindowUnload.bind(this))
  },

  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeWindowUnload.bind(this))
  },

  methods: {
    beforeWindowUnload (event) {
      if (!this.isValueChanged) {
        event.preventDefault()
        return
      }

      // Value changed. Ask for confirmation from user
      event.returnValue = this.$t('general.discardConfirmText')
      return this.$t('general.discardConfirmText')
    }
  }
}

export default UnsavedLeaveWarningMixin
