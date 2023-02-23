<template>
  <div :class="['base-tags-input', {'base-tags-input--invalid': !isValid}]">
    <div class="vue-tags-input-wrapper">
      <label class="base-tags-label" v-if="label">{{ label }}</label>
      <vue-tags-input
          v-model="tag"
          :tags="value"
          :placeholder="placeholder"
          @tags-changed="newTags => $emit('change', newTags)"
          :autocomplete-items="autocompleteItems"
          :autocomplete-min-length="0"
      />
    </div>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  components: {
    VueTagsInput
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
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
    validations: {
      type: Object,
      required: false
    },
    autocompleteItems: {
      type: Array
    }
  },
  data () {
    return {
      tag: ''
    }
  },
  computed: {
    isValid () {
      if (this.validations) {
        if (this.validations.required && !this.value) {
          return false
        }

        if (this.value && this.validations.method && !this.validations.method(this.value)) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style src="./base-tags-input.scss" lang="scss"></style>
