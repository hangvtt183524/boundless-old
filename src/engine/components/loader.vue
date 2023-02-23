<template lang="pug">
  .page-component.loader-component(
    :style="loaderStyle"
  )
    //- i(:class="config.loaderType")
    font-awesome-icon(
      :icon="spinnerIcon"
      class="fa-spin"
    )
</template>

<script>
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/loader'

export default {
  props: ['index', 'config'],
  mixins: [
    commonStyles,
    componentStyles
  ]
}
</script>
