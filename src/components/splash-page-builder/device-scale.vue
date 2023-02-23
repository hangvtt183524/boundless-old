<template lang="pug">
  div.scale-selector
    v-menu.scale-menu(
      :close-on-content-click="false"
      :nudge-bottom="10"
      offset-y
      transition="slide-y-transition"
      v-model="menu"
    )
      h3.scale-menu-heading(slot="activator")
        span {{(currentScale*100).toFixed(0)}}%
        span.caret-icon(v-show="menu")
          v-icon(small) fas fa-caret-up
        span.caret-icon(v-show="!menu")
          v-icon(small) fas fa-caret-down
      v-card.scale-menu-dropdown
        ul.scale-list
          li.scale-group
            ul
              li.scale-item(
                v-for="scale in scales",
                :key="scale.label",
                :class="{'active': autoAdjust? (scale.value === 'auto-adjust') : scale.value === currentScale}"
                @click="selectScale(scale.value)"
              )
                span.scale-item-icon
                  v-icon(small) fas fa-check
                span {{ scale.label }}
</template>

<script>
export default {
  props: ['currentScale', 'autoAdjust'],
  data () {
    return {
      menu: false,
      search: '',
      scales: [
        {
          value: 0.5,
          label: '50%',
          portrait: true
        },
        {
          value: 0.75,
          label: '75%',
          portrait: true
        },
        {
          value: 1,
          label: '100%',
          portrait: true
        },
        {
          value: 1.25,
          label: '125%',
          portrait: true
        },
        {
          value: 1.5,
          label: '150%',
          portrait: true
        },
        {
          value: 'auto-adjust',
          label: 'Auto adjust',
          portrait: true
        }
      ]
    }
  },
  methods: {
    selectScale (scaleValue) {
      this.$emit('select', scaleValue)
      this.menu = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .scale-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 70px;
  }

  .scale-menu {
    font-family: 'Fira Sans', sans-serif;

    .scale-menu-heading {
      font-size: 18px;
      color: $primary;
      position: relative;
    }

    .caret-icon {
      position: absolute;
      top: 5px;
      margin-left: 6px;
      top: 0px;
    }

    .v-menu__content {
      box-shadow: none !important;
    }

  }

  .v-flex {
    display: flex;
  }

  .scale-menu-dropdown {
    padding: 10px;
    box-shadow: none !important;
    border: 1px solid $light-gray;
    min-width: 150px;
  }

  .scale-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    color: #ffffff;
    background-color: $primary;
    height: 40px;
    width: 40px;

    &:hover {
      background-color: lighten($primary, 5%);
    }

    .v-icon {
      color: #ffffff;
    }

    &.new-scale {
      padding: 0 10px;
      width: auto;
      font-size: 20px;

      .circle-container {
        margin-left: 5px;
      }
    }
  }

  .circle-container {
    border-radius: 100px;
    border: 1px solid #ffffff;
    height: 26px;
    width: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .scale-list {
    list-style-type: none;
    padding: 0;
    max-height: 350px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: $light-gray;
      border: 3px solid transparent;
      background-clip: content-box;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: $success;
      border: 1px solid $success;
      border-radius: 5px;
    }

    .scale-group {
      margin-right: 5px;
      margin-top: 10px;
      ul {
        padding: 0;
      }
      .scale-title {
        padding: 5px 10px;
        border-radius: 5px;
        display: block;
        background: $gray-xlight;
        margin: 5px 0;
        color: #8995ae;
      }
    }

    .scale-item {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 2px;
      position: relative;

      .scale-item-icon {
        display: none;
        color: #ffffff;
        margin-right: 5px;
        position: absolute;
        top: 5px;
        right: 5px;

        svg {
          color: #ffffff;
        }
      }

      &:hover {
        background-color: lighten($light-gray, 5%);
      }

      &.active {
        background-color: $primary;
        color: #ffffff;

        .scale-item-icon {
          display: block;
        }
      }
    }
  }
</style>
