import CurrentUserMixin from './current-user.mixin'

const CampaignScheduleMixin = {
  mixins: [
    CurrentUserMixin
  ],
  computed: {
    startMaxDate () {
      if (this.value.endDate) {
        if (this.value.startTime && this.value.endTime && this.value.startTime > this.value.endTime) {
          return this.strToDate(this.value.endDate).subtract(1, 'd').toISOString()
        }
        return this.strToDate(this.value.endDate).toISOString()
      }
      return null
    },
    endMinDate () {
      if (this.value.startDate) {
        if (this.value.startTime && this.value.endTime && this.value.startTime > this.value.endTime) {
          return this.strToDate(this.value.startDate).add(1, 'd').toISOString()
        }
        return this.strToDate(this.value.startDate).toISOString()
      }
      return new Date().toISOString()
    },
    startMaxTime () {
      if (this.value.startDate && this.value.endDate && this.value.startDate === this.value.endDate && this.value.endTime) {
        return this.value.endTime
      }
      return null
    },
    endMinTime () {
      if (this.value.startDate && this.value.endDate && this.value.startDate === this.value.endDate && this.value.startTime) {
        return this.value.startTime
      }
      return null
    }
  }
}

export default CampaignScheduleMixin
