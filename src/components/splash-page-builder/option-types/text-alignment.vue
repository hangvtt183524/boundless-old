<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.textAlignment') }}
    .alignment-buttons
      .align-button(
        v-for="alignment in alignments",
        :class="{'active': alignment.name === selectedItem.config[configKey]}"
        @click="selectedItem.config[configKey] = alignment.name"
      )
        v-icon {{ alignment.icon }}
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
      default: 'textAlignment'
    }
  },
  data () {
    return {
      alignments: [
        {
          name: 'left',
          icon: 'fas fa-align-left'
        },
        {
          name: 'center',
          icon: 'fas fa-align-center'
        },
        {
          name: 'right',
          icon: 'fas fa-align-right'
        },
        {
          name: 'justify',
          icon: 'fas fa-align-justify'
        }
      ]
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
