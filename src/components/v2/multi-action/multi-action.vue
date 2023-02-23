<template lang="pug">
  .multi-action(
    :tabindex="tabindex"
    @blur="onBlur"
    :class="[{'multi-action--icon-triggered': isIconTriggered}, {'multi-action--active': menuVisible}, {'multi-action--disabled': disabled}]"
  )
    .multi-action__trigger(
      @click.stop="onDropdownHandleClick"
      ref="dropdownHandle"
    )
      span(
        v-if="!isIconTriggered"
      ) {{ label ?  label : $t('general.actions') }}
      v-tooltip(
        :color="'#223d70'"
        light
        :disabled="!tooltip"
      )
        template(v-slot:activator="{ on }")
          v-icon(
            icon-color="#223d70"
            v-on="on"
          ) {{ icon }}
        span {{ tooltip }}

    .multi-action__actions(
      v-show="menuVisible"
      ref="options"
    )
      .multi-action__actions__action(
        v-for="action of actions"
        :key="action.type"
        @click.stop="onActionClick(action)"
        :class="[{'multi-action__actions__action--disabled': action.disabled}]"
      )
        | {{ action.label }}
</template>

<script>
import DropdownItemMixin from '@/mixins/dropdown-item.mixin'

export default {
  name: 'MultiAction',
  mixins: [
    DropdownItemMixin
  ],
  props: {
    label: {
      default: ''
    },
    icon: {
      default: ''
    },
    tooltip: {
      default: ''
    },
    actions: {
      type: Array,
      default: null
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isIconTriggered () {
      return !!this.icon
    }
  },
  methods: {
    onActionClick (action) {
      if (action.disabled) {
        return false
      }

      this.hideOptions()
      this.$emit('actionClick', action.type)
    },
    onBlur () {
      this.hideOptions()
    },
    computeDropdownPosition: function () {
      // Overriding this method as with this component, we don't have the options and the trigger in same width
      const borderWidth = 2
      const handleBoundingBox = this.$refs.dropdownHandle.getBoundingClientRect()

      if (window.innerWidth - handleBoundingBox.left < 350) {
        // Not enough space on the right, position options to the left of element
        this.$refs.options.style.right = (window.innerWidth - handleBoundingBox.left - handleBoundingBox.width - borderWidth) + 'px'
      } else {
        // Position options to the right of element
        this.$refs.options.style.left = (handleBoundingBox.left - borderWidth) + 'px'
      }

      this.$refs.options.style.minWidth = (handleBoundingBox.width + (borderWidth * 2)) + 'px'

      if (this.isUpwards) {
        this.$refs.options.style.top = null
        this.$refs.options.style.bottom = (window.innerHeight - handleBoundingBox.top) + 'px'
      } else {
        this.$refs.options.style.top = handleBoundingBox.bottom + 'px'
        this.$refs.options.style.bottom = null
      }
    }
  }
}
</script>

<style src="./multi-action.scss" lang="scss" scoped></style>
