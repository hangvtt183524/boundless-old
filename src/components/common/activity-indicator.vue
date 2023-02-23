<template lang="pug">
  transition(name='fade', mode='out-in')
    #showActivityIndicator(v-show='show', :class="show ? 'loading' : 'loaded'")
      span.activityTag
        | LOADING...
</template>

<script>
export default {
  name: 'activity-indicator',
  props: {
    show: Boolean
  }
}
</script>

<style lang="sass" scoped>
  @-webkit-keyframes spin
    from
      -webkit-transform: rotate(0deg)
      transform: rotate(0deg)
    to
      -webkit-transform: rotate(360deg)
      transform: rotate(360deg)

  @keyframes spin
    from
      -webkit-transform: rotate(0deg)
      transform: rotate(0deg)
    to
      -webkit-transform: rotate(360deg)
      transform: rotate(360deg)

  .spinning
    -webkit-animation: spin 4s linear infinite
    animation: spin 4s linear infinite

  #showActivityIndicator
    transition: all .5s ease
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    width: 100%
    height: 100%
    background: rgba(255, 255, 255, .75)
    cursor: wait
    z-index: 100

    .activityTag
      text-transform: uppercase
      font-weight: 800
      position: absolute
      top: 15%
      text-align: center
      width: 100%
      font-size: 32px
      color: #337ab7

</style>
