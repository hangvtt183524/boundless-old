<template lang="pug">
  .base-select-option(
    :class="[{'base-select-option--disabled': option.disabled}, {'base-select-option--tree': hasChildren}]"
  )
    .base-select-option__section(
      v-if="hasChildren"
      v-show="option.children.length > 0"
    )
      .base-select-option__section__title
        | {{ option.name }}
      .base-select-option__section__options
        base-select-option(
          v-for="childOption of option.children"
          :option="childOption"
          :key="childOption.key"
          @optionClick="onOptionClick(childOption)"
        )

    .base-select-option__option(
      v-else-if="!option.tooltip"
      :value="option.key"
      :key="option.key"
      @click="onOptionClick(option)"
      :class="{'base-select-option__option--highlighted': option.highlighted}"
    )
      | {{ option.name }}

    v-tooltip(
      v-else
      right
      color="#eb5757"
      light
    )
      template(v-slot:activator="{ on }")
        .base-select-option__option(
          :value="option.key"
          :key="option.key"
          @click="onOptionClick(option)"
          :class="{'base-select-option__option--highlighted': option.highlighted}"
          v-on="on"
        )
          | {{ option.name }}
      span {{ option.tooltip }}

</template>

<script>
export default {
  name: 'base-select-option',
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasChildren () {
      return this.option.hasOwnProperty('children')
    }
  },
  methods: {
    onOptionClick (option) {
      if (option.disabled) {
        return false
      }

      this.$emit('optionClick', option)
    }
  }
}
</script>
