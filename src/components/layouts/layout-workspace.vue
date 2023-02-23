<template lang='pug'>
  .workspace-router-container
    router-view(:auth="auth", :authenticated="authenticated")

</template>

<script>
export default {
  name: 'LayoutWorkspace',
  props: ['authenticated', 'auth']
}
</script>

<style lang="scss">
  .workspace-router-container {
    width: 100%;
  }
</style>
