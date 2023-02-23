<template lang="pug">
  div.translation-options-selector
    v-menu.option-menu(
      :close-on-content-click="false"
      :nudge-bottom="10"
      offset-y
      transition="slide-y-transition"
      v-model="menu"
    )
      h3.option-menu-heading(slot="activator") actions
      v-card.option-menu-dropdown
        ul.option-list
          li.option-item(
            v-for="option in options",
            :key="option.name",
            @click="selectOption(option.name)"
          )
            span {{ option.title }}
</template>

<script>
export default {
  props: [],
  data () {
    return {
      menu: false,
      options: [
        {
          name: 'preview',
          title: 'Preview'
        },
        {
          name: 'set-as-default',
          title: 'Set as default'
        },
        {
          name: 'remove',
          title: 'Remove'
        }
      ]
    }
  },
  methods: {
    selectOption (optionName) {
      this.$emit('select', optionName)
      this.menu = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .option-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 230px;
  }

  .option-menu {
    font-family: 'Fira Sans', sans-serif;

    .option-menu-heading {
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

  .option-menu-dropdown {
    padding: 10px;
    box-shadow: none !important;
    border: 1px solid $light-gray;
    min-width: 250px;
  }

  .option-menu-button {
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

    &.new-option {
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

  .option-list {
    list-style-type: none;
    padding: 0;
    max-height: 500px;
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

    .option-group {
      margin-right: 5px;
      margin-top: 10px;
      ul {
        padding: 0;
      }
      .option-title {
        padding: 5px 10px;
        border-radius: 5px;
        display: block;
        background: $gray-xlight;
        margin: 5px 0;
        color: #8995ae;
      }
    }

    .option-item {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 2px;
      position: relative;

      .option-item-icon {
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

        .option-item-icon {
          display: block;
        }
      }
    }
  }
</style>
