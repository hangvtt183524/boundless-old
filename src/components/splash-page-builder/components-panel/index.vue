<template lang="pug">
  .components-panel(v-if="page.config && show")
    h3.mb-4  {{$t('builder.components')}}
    ul.components-list
      li(@click.stop="onAddComponent('base-link')")
        span {{$t('builder.link')}}
      li(@click.stop="openBkPanel")
        span {{$t('builder.pageBackground')}}
</template>

<script>

export default {
  props: ['page', 'show', 'windowSize'],
  data () {
    return {}
  },
  components: {},
  methods: {
    onAddComponent (componentName) {
      this.$eventHub.$emit('add-component', componentName)
    },
    openBkPanel () {
      this.$eventHub.$emit('open-bkpanel')
    },
    resetAll () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";

  .page-builder {
    .components-panel {
      position: relative;

      .components-list {
        width: 100%;
        padding: 0px;
      }

      .components-list li {
        display: block;
        font-size: 15px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding-bottom: 5px;
        cursor: pointer;
        margin-bottom: 10px;

        .v-icon {
          color: $primary !important;
          display: none;
        }

        &.active {
          color: $primary;

          .v-icon {
            display: block;
          }

          .sub-panel {
            opacity: 1;
            visibility: visible;
          }
        }
      }

      .sub-panel {
        position: absolute;
        min-width: 300px;
        left: calc(100% + 1px);
        background: hsla(213, 39%, 90%, 1);
        color: #0f202f;
        top: 1px;
        padding: 15px;
        opacity: 0;
        visibility: hidden;
        cursor: default;
        height: 100%;

        label {
          color: rgba(0,0,0,.54);
        }
      }
    }
  }
</style>
