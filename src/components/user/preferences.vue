<template lang="pug">
  editable-panel(
    data-test="preferences"
    :is-editing="isEditing"
    :is-loading="isLoading"
    :title="$t('general.preferences')"
    @cancel="cancel"
    @edit="edit"
    @submit="submit"
  )
    v-form(slot-scope="{readonly}")
      v-layout(row wrap)
        v-flex(xs12 md6 px-3)
          v-select.language(
            data-test="language"
            :items="getChoices('language')"
            :label="$t('general.language')"
            :readonly="readonly"
            item-text="display_name"
            placeholder="--"
            v-model="formData.language"
          )

        v-flex(xs12 md6 px-3)
          v-select.timezone(
            data-test="timezone"
            :items="getChoices('timezone')"
            :label="$t('general.timezone')"
            :readonly="readonly"
            item-text="display_name"
            placeholder="--"
            v-model="formData.timezone"
          )

        v-flex(xs12 md6 px-3)
          v-select.date-format(
            data-test="date-format"
            :items="getChoices('date_format')"
            :label="$t('general.dateFormat')"
            :readonly="readonly"
            item-text="display_name"
            placeholder="--"
            v-model="formData.date_format"
          )

        v-flex(xs12 md6 px-3)
          v-select.time-format(
            data-test="time-format"
            :items="getChoices('time_format')"
            :label="$t('general.timeFormat')"
            :readonly="readonly"
            item-text="display_name"
            placeholder="--"
            v-model="selectedTimeFormat"
          )

        v-flex(xs12 md6 px-3)
          v-select.first-day-of-week(
            data-test="first-day-of-week"
            :items="getChoices('first_day_of_week')"
            :label="$t('general.firstDayOfWeek')"
            :readonly="readonly"
            item-text="display_name"
            placeholder="--"
            v-model="formData.first_day_of_week"
          )
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CurrentUserMixin from '@/mixins/current-user.mixin'
import EditablePanelMixin from '@/mixins/editable-panel.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import EditablePanel from '@/components/common/editable-panel'
import timezoneList from '@/utils/timezone-list'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'Preferences',
  components: {
    EditablePanel
  },
  mixins: [
    CurrentUserMixin,
    EditablePanelMixin,
    ErrorHandlerMixin
  ],
  mounted () {
    this.setFormData()
  },
  data () {
    return {
      formData: {
        language: '',
        date_format: '',
        timeFormat: '',
        timezone: '',
        first_day_of_week: ''
      },
      selectedTimeFormat: '',
      timeFormatChoices: [
        { value: '12-hour', text: '12-hour time' },
        { value: '24-hour', text: '24-hour time' }
      ]
    }
  },
  computed: {
    ...mapGetters(['countries']),
    ...mapGetters('user', ['userOptions']),
    profileOptions () {
      try {
        return this.userOptions.data.actions.PUT.profile
      } catch (TypeError) {
        return null
      }
    }
  },
  methods: {
    ...mapActions(['fetchCountries']),
    getChoices (key) {
      try {
        if (key === 'language') {
          if (this.formData.language === 'en') {
            return [
              { display_name: 'English', value: 'en' },
              { display_name: 'French', value: 'fr' }
            ]
          }
          if (this.formData.language === 'fr') {
            return [
              { display_name: 'English', value: 'en' },
              { display_name: 'Francais', value: 'fr' }
            ]
          }
        } else if (key === 'first_day_of_week') {
          if (this.formData.language === 'en') {
            return [
              { display_name: 'Sunday', value: 0 },
              { display_name: 'Monday', value: 1 }
            ]
          }
          if (this.formData.language === 'fr') {
            return [
              { display_name: 'Dimanche', value: 0 },
              { display_name: 'Lundi', value: 1 }
            ]
          }
        } else if (key === 'time_format') {
          if (this.formData.language === 'en') {
            return [
              { value: '12-hour', display_name: '12-hour time' },
              { value: '24-hour', display_name: '24-hour time' }
            ]
          }
          if (this.formData.language === 'fr') {
            return [
              { value: '12-hour', display_name: '12 heures' },
              { value: '24-hour', display_name: '24 heures' }
            ]
          }
        } else if (key === 'timezone') {
          return timezoneList
        } else if (key === 'date_format') {
          return [
            { display_name: 'mm/dd/YYYY', value: 'mdy' },
            { display_name: 'dd/mm/YYYY', value: 'dmy' }
          ]
        }
      } catch (TypeError) {
        return []
      }
    },
    setFormData () {
      const profile = this.profile
      this.formData = Object.assign({}, this.formData, {
        language: profile.language,
        date_format: profile.date_format,
        timezone: profile.timezone,
        use_24h_clock: profile.use_24h_clock,
        first_day_of_week: profile.first_day_of_week
      })
      this.selectedTimeFormat = profile.use_24h_clock ? '24-hour' : '12-hour'
    },
    submit () {
      this.isLoading = true

      const use24hClock = this.selectedTimeFormat === '24-hour'
      this.$set(this.formData, 'use_24h_clock', use24hClock)

      this.updateCurrentUser({ profile: this.formData }).then(response => {
        this.isLoading = false
        this.isEditing = false
        this.showSuccessMessage()
        window.location.reload()
      }).catch(err => {
        this.isLoading = false
        this.setErrorData(err)
      })

      EventTracker.sendEvent(EVENT_NAMES.PROFILE_PREFERENCES_UPDATED, {
        changed_fields: ['language', 'date_format', 'timezone', 'use_24h_clock', 'first_day_of_week'].filter(field => this.profile[field] !== this.formData[field])
      })
    }
  }
}
</script>
