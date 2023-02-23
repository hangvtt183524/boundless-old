<template lang="pug">
#topbar
  v-toolbar.topbar.white(
    fixed
    app
  )
    .title
      h3 Documentation of Boundless Digital
    v-spacer
    v-toolbar-items.toolbar-items
      v-btn#back-to-website.back-to-website(
        flat
        @click='onBackToWebsite'
      )
        span Back to Website
</template>

<script>
export default {
  name: 'topbar',
  methods: {
    onBackToWebsite () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="scss">
#topbar {
  .topbar {
    .toolbar__content {
      height: 64px!important;
    }
    .title {
      margin-left: 20px;
      color: gray;
    }
    .toolbar-items {
      margin-right: 0;
      .back-to-website {
        font-size: 16px;
        letter-spacing: 0.4px;
        color: #5f98f4;
        &:hover:enabled {
          background: #5f98f4 !important;
          color: white;
        }
        &:disabled {
          color: #dadada;
        }
      }
    }
  }
}
</style>
