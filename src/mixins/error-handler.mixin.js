// Mixin for parsing and coverting backend error response
// into an accessible data that can be used to display
// error messages in the form

export default {
  data () {
    return {
      errorData: {}
    }
  },
  methods: {
    clearErrorData () {
      this.errorData = {}
      if (this.$v) {
        this.$v.$reset()
      }
    },
    getVueErrors (fieldName) {
      if (!fieldName) {
        return []
      }
      let validations = this.$options.validations
      let field = this.$v
      for (let key of fieldName.split('.')) {
        validations = validations[key]
        field = field[key]
      }
      if (!field.$dirty) return []

      for (let validator of Object.keys(validations)) {
        if (!field[validator]) {
          let message = ''
          if (validator === 'between') {
            const kwargs = {
              min: field.$params.between.min,
              max: field.$params.between.max
            }
            message = this.$t(`errors.${validator}`, kwargs)
          } else if (validator === 'maxLength') {
            const kwargs = {
              max: field.$params.maxLength.max
            }
            message = this.$t(`errors.${validator}`, kwargs)
          } else {
            message = this.$t(`errors.${validator}`)
          }
          return [message]
        }
      }
      return []
    },
    getErrorMessages (key, obj = null) {
      /*
        Returns array of error messages based on the given `key`.
      */
      let data = this.errorData
      if (obj) {
        data = obj
      }
      const error = key in data ? data[key] : null
      if (error) {
        if (Array.isArray(error)) {
          // if `error` is an array, it would have the format of:
          // [{"message": "Error message", "code": "invalid"}]
          // we only want to return an array of the `message`
          return error.map(item => {
            return 'message' in item ? item.message : []
          })
        } else if (typeof error === 'string') {
          return [error]
        } else if (typeof error === 'object' && 'message' in error) {
          return Array.isArray(error.message) ? error.message : [error.message]
        }
      }
      return []
    },
    getErrorCodes (key, obj = null) {
      /*
        Returns array of error codes based on the given `key`.
      */
      let data = this.errorData
      if (obj) {
        data = obj
      }
      const error = key in data ? data[key] : null
      if (error) {
        if (Array.isArray(error)) {
          return error.map(item => {
            return 'code' in item ? item.code : []
          })
        } else if (typeof error === 'string') {
          return [error]
        } else if (typeof error === 'object' && 'code' in error) {
          return Array.isArray(error.code) ? error.code : [error.code]
        }
      }
      return []
    },
    hasVueError (fieldName) {
      return this.getVueErrors(fieldName).length > 0
    },
    setErrorData (err) {
      /*
        Parse error response from backend and sets `errorData`
        from the `detail` key of error response.
        Below is a sample error response format from our backend.

        {
          "reason": "ValidationError",
          "status": 400,
          "code": "invalid",
          "message": "Invalid input.",
          "detail": {
            "email": [{
              "message": "This field must be unique.",
              "code": "unique"
            }]
          }
        }

        This function also handles if `err` is in the wrong format.
      */
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.detail) {
        this.errorData = { ...err.response.data.error.detail }
      } else {
        this.clearErrorData()
      }
    }
  }
}
