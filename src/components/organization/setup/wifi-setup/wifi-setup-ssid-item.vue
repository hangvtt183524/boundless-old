<template lang="pug">
  .wifi-setup-ssid-item(
    :class="[{'wifi-setup-ssid-item--selected': selected}, {'wifi-setup-ssid-item--disabled': value.enabled === false}]"
    @click="onSsidItemClick"
  )
    .wifi-setup-ssid-item__name(
      v-if="!editing"
    ) {{ value.name }}
    input.wifi-setup-ssid-item__name-input(
      v-if="editing"
      type="text"
      v-model="nameValue"
      @keyup.enter="onInputEnterPress"
      @blur="onInputBlur"
      ref="nameInput"
    )
</template>

<script>
export default {
  name: 'wifi-setup-ssid-item',
  props: {
    value: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      editing: false,
      nameValue: ''
    }
  },
  methods: {
    onSsidItemClick () {
      if (!this.value.enabled) {
        if (!this.editing) {
          this.editing = true
          setTimeout(() => {
            this.$refs.nameInput.focus()
          }, 100)
        }
      } else {
        this.$emit('click', this.value)
      }
    },
    onInputBlur () {
      this.editing = false
    },
    onInputEnterPress () {
      this.editing = false
      if (this.nameValue) {
        this.$emit('input', {
          ...this.value,
          name: this.nameValue,
          enabled: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";

  .wifi-setup-ssid-item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: $white;
    border: 1px solid $gray-dark;
    border-radius: 3px;
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;

    &__name {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      padding: 0 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__name-input {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      height: 20px;
      line-height: 20px;
      border: 0;
      outline: 0;
      padding: 0 15px;
      width: 100%;
      text-align: center;
    }

    &--selected {
      background: $blue-medium;
      border-color: $blue-medium;
      color: $white;
    }

    &--disabled {
      background: #f2f2f2;
      border-color: #f2f2f2;

      .wifi-setup-ssid-item__name {
        color: #828282;
      }
    }
  }
</style>
