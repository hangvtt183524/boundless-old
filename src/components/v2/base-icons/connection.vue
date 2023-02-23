<template>
  <i>
    <svg width="1em" height="1em" :fill="iconColor" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0.999999L13 1L13 9L10.7297 9L10.7297 10.8182L8.78378 10.8182L8.78378 13L5.05405 13L5.05405 10.8182L3.43243 10.8182L3.43243 9L1 9L1 0.999999Z" :fill="iconColor"/>
    </svg>
  </i>
</template>

<script>
export default {
  name: 'connection-icon',
  props: {
    iconColor: {
      type: String,
      default: '#c8cdd5'
    }
  }
}
</script>
