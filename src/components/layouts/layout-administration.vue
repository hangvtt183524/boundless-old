<template lang='pug'>
  .administration-router-container
    router-view(:auth="auth", :authenticated="authenticated")
</template>

<script>

export default {
  name: 'LayoutAdministration',
  props: ['authenticated', 'auth']
}
</script>

<style lang="scss">
  .administration-router-container {
    width: 100%;
  }
</style>
