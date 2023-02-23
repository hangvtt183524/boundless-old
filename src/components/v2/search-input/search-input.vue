<template lang="pug">
  base-text-input(
    v-model="search"
    :placeholder="placeholder"
    :label="label"
    :disabled="disabled"
    pre-icon="search"
  )
    v-icon.search-input__clear-icon(
      v-if="search"
      @click="onClearClick()"
    ) close

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input.vue'
import _ from 'lodash'

export default {
  name: 'search-input',
  components: {
    BaseTextInput
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputDelay: {
      type: Number,
      default: 400
    }
  },
  data: function () {
    return {
      search: ''
    }
  },
  mounted () {
    this.search = this.value
  },
  created () {
    // Prepare debounced function for search change
    this.onSearchInput = _.debounce(() => {
      this.$emit('input', this.search)
    }, this.inputDelay)
  },
  watch: {
    search: {
      handler: function (value) {
        this.onSearchInput(value)
      },
      deep: true
    }
  },
  methods: {
    onClearClick () {
      this.search = ''
    }
  }
}
</script>
