<template lang="pug">
#bottombar
  v-footer.footer
    span {{ $t('general.documentFooter', {year: 2018}) }}
</template>

<script>
export default {
  name: 'bottombar'
}
</script>

<style lang="scss">
#bottombar {
  position: absolute;
  bottom: 0;
  width: 100%;
  .footer {
    height: 40px!important;
    padding: 0 20px;
    background: #333;
    color: white;
    box-shadow: 0 -1px 1px -1px rgba(0,0,0,.2), 0 0 1px 0 rgba(0,0,0,.14), 0 -1px 3px 0 rgba(0,0,0,.12);
  }
}
</style>
