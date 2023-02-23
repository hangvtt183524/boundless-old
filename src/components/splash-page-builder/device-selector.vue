<template lang="pug">
  div.device-selector
    v-menu.device-menu(
      :close-on-content-click="false"
      :nudge-bottom="10"
      offset-y
      transition="slide-y-transition"
      v-model="menu"
    )
      h3.device-menu-heading(slot="activator")
        span {{selectedDeviceTitle}}
        span.caret-icon(v-show="menu")
          v-icon(small) fas fa-caret-up
        span.caret-icon(v-show="!menu")
          v-icon(small) fas fa-caret-down
      v-card.device-menu-dropdown
        ul.device-list
          li.device-group(v-for="group in deviceGroups")
            .device-title {{group.groupName}}
            ul
              li.device-item(
                v-for="device in group.devices",
                :key="device.name",
                :class="{'active': selectedDevice == device.name}"
                @click="selectDevice(device.name)"
              )
                span.device-item-icon
                  v-icon(small) fas fa-check
                span {{ device.title }}
</template>

<script>
export default {
  props: ['selectedDevice'],
  data () {
    return {
      menu: false,
      search: '',
      deviceGroups: [
        {
          groupName: 'Mobile',
          devices: [
            {
              name: 'galaxy-s5-portrait',
              title: 'Galaxy S5 Portrait',
              portrait: true
            },
            {
              name: 'pixel-2-portrait',
              title: 'Pixel 2 Portrait',
              portrait: true
            },
            {
              name: 'pixel-2-xl-portrait',
              title: 'Pixel 2 XL Portrait',
              portrait: true
            },
            {
              name: 'iphone-5-portrait',
              title: 'iPhone 5/SE Portrait',
              portrait: true
            },
            {
              name: 'iphone-6-portrait',
              title: 'iPhone 6/7/8 Portrait',
              portrait: true
            },
            {
              name: 'iphone-6-plus-portrait',
              title: 'iPhone 6/7/8 Plus Portrait',
              portrait: true
            },
            {
              name: 'iphone-x-portrait',
              title: 'iPhone X Portrait',
              portrait: true
            }
          ]
        },
        {
          groupName: 'Tablet',
          devices: [
            {
              name: 'ipad-portrait',
              title: 'iPad Portrait',
              portrait: true
            },
            {
              name: 'ipad-pro-portrait',
              title: 'iPad Pro Portrait',
              portrait: true
            }
          ]
        },
        {
          groupName: 'Other',
          devices: [
            {
              name: 'custom-device',
              title: 'Custom Device',
              portrait: true
            }
          ]
        }
      ]
    }
  },
  computed: {
    selectedDeviceTitle () {
      let devices = []
      this.deviceGroups.forEach(group => {
        devices.push(...group.devices)
      })
      let selectedDeviceObject = devices.filter(device => device.name === this.selectedDevice)[0]
      if (selectedDeviceObject) {
        return selectedDeviceObject.title
      }
      return 'Select Device'
    }
  },
  methods: {
    selectDevice (deviceName) {
      this.$emit('select', deviceName)
      this.menu = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .device-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 230px;
  }

  .device-menu {
    font-family: 'Fira Sans', sans-serif;

    .device-menu-heading {
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

  .device-menu-dropdown {
    padding: 10px;
    box-shadow: none !important;
    border: 1px solid $light-gray;
    min-width: 250px;
  }

  .device-menu-button {
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

    &.new-device {
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

  .device-list {
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

    .device-group {
      margin-right: 5px;
      margin-top: 10px;
      ul {
        padding: 0;
      }
      .device-title {
        padding: 5px 10px;
        border-radius: 5px;
        display: block;
        background: $gray-xlight;
        margin: 5px 0;
        color: #8995ae;
      }
    }

    .device-item {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 2px;
      position: relative;

      .device-item-icon {
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

        .device-item-icon {
          display: block;
        }
      }
    }
  }
</style>
