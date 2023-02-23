<template lang='pug'>
  router-view
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { stopZoomingWhenDoubleTapped } from './utils/functions'
import { EventTracker } from '@/services/event-tracker'
import JQuery from 'jquery'

window.$ = JQuery

export default {
  name: 'Main',

  mounted () {
    // remove loader when load finish
    let loaderElement = document.getElementById('loader')
    if (loaderElement) {
      loaderElement.style.display = 'none'
    }

    this.setIsMobile()

    this.setPointerIsTouch('ontouchstart' in window)

    if (this.pointerIsTouch) {
      stopZoomingWhenDoubleTapped()
    }

    this.setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    window.addEventListener('resize', () => {
      clearTimeout(this.debounceWindowResize)
      this.debounceWindowResize = setTimeout(() => {
        this.setIsMobile()
        this.setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, 1e3)
    })
  },

  computed: {
    ...mapGetters(['isMobile', 'pointerIsTouch', 'showActivityIndicator'])
  },

  watch: {
    $route: {
      immediate: true,
      handler (to, previous) {
        // Set page title on route change
        document.title = to.meta.title || 'Boundless Digital'

        // Send page change event via event tracker. Skip initial trigger of event on page load.
        if (previous) {
          EventTracker.sendPageView(EventTracker.getRoutePageName(to))
        }
      }
    }
  },

  methods: {
    ...mapActions(['setIsMobile', 'setWindowSize', 'setPointerIsTouch']),
    stopActivityIndicator () {
      this.$store.commit('UPDATE_ACTIVITY_INDICATOR', false)
    }
  }
}
</script>

<style lang="sass">
  .table-container
    width: 100%
</style>
