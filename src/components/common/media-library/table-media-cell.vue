<template lang='pug'>
  .table-media-cell
    .preview-img(
      v-if="item.asset_type === 'image'"
      :class="[{ 'no-square-bg': isNoTransparentBg(fileUrl) }]"
    )
      .image-wrapper
        img(
          :src="fileUrl"
        )
    video(controls v-if="item.asset_type === 'video'")
      source(:src="fileUrl" :type="item.content_type")
</template>

<script>
export default {
  name: 'table-media-cell',
  components: { },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    }
  },
  data: function () {
    return {
    }
  },
  computed: {
    fileUrl () {
      return this.item.url || this.item.original_url
    }
  },
  mounted () {
  },
  methods: {
    isNoTransparentBg (fileName) {
      var patt = /([^/]*)\.(jpg|jpeg|tiff)$/i
      var result = patt.exec(fileName)
      return !!result
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-media-cell {
    position: relative;
    margin: 1px 0 1px 0;
    vertical-align: middle;

    .preview-img {
      background-image: url('~@/assets/images/pattern-bg.png');
      background-repeat: repeat;
      width: 60px;
      height: 60px;
      position: relative;
      display: inline-block;
      cursor: pointer;
      vertical-align: middle;

      .image-wrapper {
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
    video {
      width: 60px;
      height: 60px;
    }
  }
</style>
