import { url } from 'vuelidate/lib/validators'

let CampaignUrlMixin = {
  methods: {
    urlAppendIcon (fieldName, value) {
      if (!value) {
        return null
      } else if (this.getUrlErrors(value).length) {
        if (fieldName && this.hasVueError(fieldName)) {
          return 'close'
        } else if (!fieldName) {
          return 'close'
        }
      } else if (url(value)) {
        return 'done'
      } else {
        return null
      }
    },
    getUrlErrors (value, isAllowEmpty = true) {
      const errors = []
      if (!url(value)) {
        errors.push(this.$t('errors.url'))
      }
      if (!value && !isAllowEmpty) {
        errors.push(this.$t('errors.required'))
      }
      return errors
    }
  }
}

export default CampaignUrlMixin
