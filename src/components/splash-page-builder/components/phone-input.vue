<template lang="pug">
  tel-input.phone-input(
    :index="index",
    :config="config",
    :lang="lang"
    :default-lang="defaultLang"
    :component="component",
    :selected-item="selectedItem",
    :selected-page="selectedPage",
    :page-config="pageConfig",
    @select="selectItem"
    @onInput="onChange"
    :data-title="$t('builder.phoneInput')"
  )
</template>

<script>
import telInput from './tel-input/input'
import selectedItemMixin from '../mixins/selected-item-mixin'

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    config: {
      type: Object,
      required: true
    },
    lang: {
      type: String
    },
    defaultLang: {
      type: String
    },
    selectedItem: {
      required: true
    },
    component: {
      type: Object,
      required: true
    },
    selectedPage: {
      type: Object,
      required: true
    },
    pageConfig: {
      type: Object,
      required: true
    }
  },
  mixins: [
    selectedItemMixin
  ],
  components: {
    telInput
  },
  methods: {
    onChange (response) {
      this.config.defaultSelection = response
    }
  }
}
</script>
