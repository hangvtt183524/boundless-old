import axios from 'axios'

let FormSubmissionMixin = {
  data: function () {
    return {
      retryCount: 0,
      maxRetryCount: 9
    }
  },
  computed: {
    translatedErrorMessage () {
      try {
        if (typeof this.errorMessage === 'string') {
          if (this.errorMessage.indexOf('engine.') !== -1) {
            return this.$t(this.errorMessage)
          }
          return this.errorMessage
        }
        return this.errorMessage
      } catch (err) {
        return err
      }
    }
  },
  methods: {
    handleUnexpectedCodeErrors (err) {
      this.showError = true
      this.errorMessage = err.toString()
    },
    handleStatusErrors (error) {
      // console.error(error)
      // this.isLoading = false
      this.showError = true
      if (error.response.status === 408 || error.code === 'ECONNABORTED') {
        this.errorMessage = 'engine.errorTimeout'
      } else if (error.response.status === 500) {
        // console.log('SERVER ERROR')
        this.errorMessage = 'engine.errorServer'
      } else {
        // console.log(' ERROR', error)
        this.errorMessage = error.toString()
      }
    },
    handleResponse (response, defaultErrMsg = 'engine.invalidCode') {
      if (response.data.status === 'success') { // can be 'success' (non sponsor-auth) or true (sponsor-auth)
        this.$emit('submit', response.data)
      } else if (response.data.message) {
        this.showError = true
        this.errorMessage = response.data.message
      } else if (response.data.error) { // set error from server
        this.showError = true
        this.errorMessage = 'engine.' + response.data.code
      } else { // when error code is not set, just set defaultErrMsg for default
        this.showError = true
        this.errorMessage = defaultErrMsg
      }
    },
    postLogMessage (message) {
      const server = (this.pageParams && this.pageParams.registration_server)
        ? this.pageParams.registration_server : window.location.origin

      axios.post(`${server}/api/client-log/`,
        { message: message },
        { 'headers': { 'X-Requested-With': 'XMLHttpRequest' } }
      )
    },
    shouldRetry (error) {
      return error.response.status >= 500 && error.response.status < 600 && this.retryCount <= this.maxRetryCount
    },
    retryFormSubmission (error, method) {
      // On first retry, send response text to server for logging
      if (this.retryCount === 0) {
        this.postLogMessage(error.toString())
      }

      this.retryCount += 1
      const waitTime = (1.5 ** this.retryCount) * 1000 // 1.5^n seconds
      setTimeout(method, waitTime)
    }
  }
}

export default FormSubmissionMixin
