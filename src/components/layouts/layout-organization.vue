<template lang='pug'>
  .organization-router-container
    router-view(:auth="auth", :authenticated="authenticated")

</template>

<script>
export default {
  name: 'LayoutOrganization',
  props: ['authenticated', 'auth']
}
</script>

<style lang="scss">
  .organization-router-container {
    width: 100%;
  }
</style>
