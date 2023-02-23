<template lang="pug">
  .logo-component(
    :style="logoContainerStyle"
  )
    img(:src="computedImgSrc", :style="logoStyle")
</template>

<script>
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/logo'

export default {
  props: ['index', 'config'],
  mixins: [
    commonStyles,
    componentStyles
  ],
  computed: {
    computedImgSrc () {
      return this.config.src.replace(/VUE_APP_STATIC_CDN/g, process.env.VUE_APP_STATIC_CDN)
    }
  }
}
</script>
