<template lang='pug'>
  .application-logo-cell
    .application-logo-cell__organization-logo(
      :class="[{ 'no-square-bg': isNoTransparentBackground }]"
    )
      .application-logo-cell__organization-logo__image-wrapper
        img(
          :src="organizationLogoUrl"
        )

</template>

<script>
export default {
  name: 'application-logo-cell',
  components: { },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    }
  },
  computed: {
    organizationLogoUrl () {
      return this.value || require('@/assets/images/meraki-logo.png')
    },
    isNoTransparentBackground () {
      return !!/([^/]*)\.(jpg|jpeg|tiff)$/i.exec(this.organizationLogoUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
  .application-logo-cell {
    position: relative;
    margin: 1px 0 1px 0;
    vertical-align: middle;

    &__organization-logo {
      background-image: url('~@/assets/images/pattern-bg.png');
      background-repeat: repeat;
      width: 60px;
      height: 60px;
      position: relative;
      display: inline-block;
      cursor: pointer;
      vertical-align: middle;

      &__image-wrapper {
        background: linear-gradient(180deg, rgba(#EFF3F8, 0.4) 0%, rgba(#CED8E6, 0.4) 100%);
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        height: 100%;
        img {
          position: relative;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
          max-width:calc(100% - 2px);
          max-height:calc(100% - 2px);
        }
      }
      &.no-square-bg {
        background: none;
        .image-wrapper {
          background: none;
          overflow: hidden;
          img {
            width: calc(100% - 2px);
            max-height: unset;
          }
        }
      }
    }
  }
</style>
