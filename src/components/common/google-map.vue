<template>
  <div id="google-map">
  </div>
</template>

<script>
export default {
  name: 'google-map',
  props: {
    center: {
      type: Object,
      default: () => {
        return {
          lat: 48.857117,
          lng: 2.3494571
        }
      }
    },
    markers: {
      type: Array,
      default () {
        return []
      }
    },
    zoom: {
      type: Number,
      default: 12
    }
  },
  data () {
    return {
      map: null,
      mapMarkers: []
    }
  },
  mounted () {
    this.map = new window.google.maps.Map(document.getElementById('google-map'), {
      center: this.center,
      zoom: this.zoom
    })
    if (this.markers.length) {
      this.buildMarkers()
    }
  },
  computed: {
    isStreetLevelZoom () {
      return this.zoom >= 15
    }
  },
  methods: {
    buildMarkers () {
      this.mapMarkers = []
      let bounds = new window.google.maps.LatLngBounds()
      for (let i = 0; i < this.markers.length; i++) {
        const marker = new window.google.maps.Marker({
          position: this.markers[i],
          map: this.map
        })
        bounds.extend(this.markers[i])
        this.mapMarkers.push(marker)
      }
      if (!this.isStreetLevelZoom) {
        this.map.fitBounds(bounds)
      }
    },
    clearMarkers () {
      for (let i = 0; i < this.mapMarkers.length; i++) {
        this.mapMarkers[i].setMap(null)
      }
    }
  },
  watch: {
    markers (value) {
      this.clearMarkers()
      if (value.length) {
        this.buildMarkers()
      }
    }
  }
}
</script>
<style lang="scss">
  div#google-map{
    width: 100%;
    height: 400px;
  }
</style>
