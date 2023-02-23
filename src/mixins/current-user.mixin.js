import { mapActions, mapGetters } from 'vuex'

let CurrentUserMixin = {
  computed: {
    ...mapGetters('user', ['currentUser']),
    profile () {
      return this.currentUser.profile
    },
    dateFormat () {
      let format = 'L' // 09/04/1986
      if (this.profile.date_format !== 'mdy') {
        format = 'DD/MM/YYYY'
      }
      return format
    },
    timeFormat () {
      let timeFormat = 'LT' // 8:30 PM
      if (this.profile.use_24h_clock) {
        timeFormat = 'HH:mm' // 23:00
      }
      return timeFormat
    },
    dateTimeFormat () {
      return `${this.dateFormat} ${this.timeFormat}`
    }
  },
  methods: {
    ...mapActions('user', ['updateCurrentUser']),
    dateFormatter (value, format = null, sourceFormat = null) {
      if (!value) {
        return value
      }

      const dateValue = (sourceFormat && typeof (format) === 'string')
        ? this.$moment(value, sourceFormat) : this.$moment(value)

      return (format && typeof (format) === 'string')
        ? dateValue.format(format) : dateValue.format(this.dateFormat)
    },
    timeFormatter (value, format = null) {
      if (!value) {
        return value
      }
      const dateTime = this.$moment(value)
      return dateTime.format(format || this.timeFormat)
    },
    dateTimeFormatter (value) {
      if (!value) {
        return value
      }
      return this.$moment(value).format(`${this.dateFormat} ${this.timeFormat}`)
    },
    jsonFormatter (value) {
      if (!value) {
        return value
      }

      let formatted = JSON.stringify(value, null, 2)
      const displayCharacterLimit = 200
      if (formatted.length > displayCharacterLimit) {
        formatted = formatted.substring(0, displayCharacterLimit) + '\n  ...\n}'
      }

      return formatted
    },
    strToDate (value, format = null) {
      return this.$moment(value, format || this.dateFormat)
    },
    convertSecToTimes (value) {
      value = Number(value)
      if (!value) return ''
      var hrs = Math.floor(value / 3600)
      var mins = Math.floor(value % 3600 / 60)
      var secs = Math.floor(value % 3600 % 60)
      if (hrs) {
        return mins ? `${hrs} hr ${mins} min` : `${hrs} hr`
      } else if (mins) {
        return `${mins} min`
      } else return `${secs} sec`
    }
  }
}

export default CurrentUserMixin
