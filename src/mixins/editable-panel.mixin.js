let EditablePanelMixin = {
  data () {
    return {
      isEditing: false,
      isLoading: false
    }
  },
  methods: {
    cancel () {
      this.isEditing = false
      if (typeof this.setFormData === 'function') {
        this.setFormData()
      }
      if (typeof this.clearErrorData === 'function') {
        this.clearErrorData()
      }
    },
    edit () {
      this.isEditing = true
    },
    getPlaceholder (isReadonly) {
      return isReadonly ? '--' : null
    },
    showSuccessMessage (message = null) {
      let successMessage = this.$t('general.dataSaveSuccess')
      if (message) {
        successMessage = message
      }
      global.toastr['success'](successMessage, this.$t('general.success'))
    }
  }
}

export default EditablePanelMixin
