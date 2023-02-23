<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.fontStyle') }}
    .alignment-buttons
      .align-button(
        v-for="(style, index) in styles",
        :class="{'active': selectedItem.config[configKey][style.name]}"
        @click="setFontStyle(style.name)"
        :key="index + `${selectedItem.config[configKey][style.name]}`"
      )
        v-icon {{ style.icon }}
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object,
      required: true
    },
    configKey: {
      type: String,
      default: 'fontStyle'
    }
  },
  data () {
    return {
      styles: [
        {
          name: 'bold',
          icon: 'fas fa-bold'
        },
        {
          name: 'italic',
          icon: 'fas fa-italic'
        },
        {
          name: 'underline',
          icon: 'fas fa-underline'
        }
      ]
    }
  },
  mounted () {
    this.initFontStyle()
  },
  methods: {
    initFontStyle () {
      if (!this.selectedItem.config[this.configKey] && (typeof this.selectedItem.config[this.configKey] !== 'object')) {
        this.selectedItem.config[this.configKey] = {}
        this.selectedItem.config[this.configKey]['bold'] = false
        this.selectedItem.config[this.configKey]['italic'] = false
        this.selectedItem.config[this.configKey]['underline'] = false
      }
    },
    setFontStyle (styleName) {
      this.selectedItem.config[this.configKey][styleName] = !(this.selectedItem.config[this.configKey][styleName])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/colors.scss";
@import "styles/v2/colors.scss";

.alignment-buttons {
  display: flex;
  width: 100%;

  .align-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2px;
    background: white;
    padding: 5px;
    border: 1px solid $gray-xlight;

    .v-icon {
      color: #9ba9c4;
      font-size: 20px;
    }

    &.active {
      border: 1px solid #4b83f0;

      .v-icon {
        color: #4b83f0;
      }
    }
  }
}
</style>
