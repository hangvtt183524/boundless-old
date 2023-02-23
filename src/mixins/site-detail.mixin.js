import { mapGetters } from 'vuex'
import timezoneList from '@/utils/timezone-list'

const TIMEZONE_API_URL = process.env.VUE_APP_TIMEZONE_API_URL
const TIMEZONE_API_KEY = process.env.VUE_APP_TIMEZONE_API_KEY

const SiteDetailMixin = {
  computed: {
    ...mapGetters('organization/site', ['siteOptions']),
    options () {
      try {
        return this.siteOptions.data.actions.POST
      } catch (TypeError) {
        return {}
      }
    },
    timezoneChoices () {
      return timezoneList
    }
  },
  methods: {
    setAddressFromPlace (place) {
      // TODO: I think this is not the best way since we can use geocoder fro this
      // This is temporary implementation for now to get the site creation working
      const streetAddress = []
      let city = ''
      let country = ''
      let postalCode = ''
      let state = ''
      for (let item of place.address_components) {
        if (['street_number', 'route'].some(e => item.types.includes(e))) {
          streetAddress.push(item.long_name)
        } else if (item.types.includes('locality')) {
          city = item.long_name
        } else if (item.types.includes('administrative_area_level_1')) {
          state = item.long_name
        } else if (item.types.includes('postal_code')) {
          postalCode = item.long_name
        } else if (item.types.includes('country')) {
          country = item.long_name
        }
      }
      const location = place.geometry ? place.geometry.location : null
      const latitude = location && location.lat() ? location.lat() : 0
      const longitude = location && location.lng() ? location.lng() : 0
      this.$set(this.value, 'address', {
        street_address: streetAddress.join(' '),
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
        latitude,
        longitude
      })
    },
    onChangeAddress (address) {
      this.value.formattedAddress = address
    },
    setJsonAddressAndTimezone (place) {
      const lng = place.geometry.location.lng()
      const lat = place.geometry.location.lat()
      const timestamp = (Math.floor(Date.now() / 1000)).toString()

      const timezoneAPIEndpoint = TIMEZONE_API_URL + '?location=' + lat + ',' + lng + '&timestamp=' + timestamp + TIMEZONE_API_KEY
      fetch(timezoneAPIEndpoint)
        .then(response => response.json())
        .then((data) => {
          let timezone = data.timeZoneId
          const timezoneIndex = this.timezoneChoices.findIndex(item => item.value === timezone)
          if (timezoneIndex === -1) {
            this.setChoices('timezone', { value: timezone, display_name: timezone })
          }
          this.$set(this.value, 'timezone', timezone)
        })

      this.$set(this.value, 'google_places', place)
      this.$set(this.value, 'lat', lat)
      this.$set(this.value, 'lng', lng)
      this.setAddressFromPlace(place)
    },
    setChoices (key, value) {
      try {
        this.options[key].choices.push(value)
      } catch (TypeError) {

      }
    }
  }
}

export default SiteDetailMixin
