<template lang="pug">
  base-text-input.password-input(
    :index="index",
    :config="config",
    :lang="lang"
    :default-lang="defaultLang"
    :component="component",
    :selected-item="selectedItem",
    :selected-page="selectedPage",
    :page-config="pageConfig",
    @select="selectItem"
  )
</template>

<script>
import baseTextInput from './text-input'
import selectedItemMixin from '../mixins/selected-item-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang', 'selectedItem', 'component', 'selectedPage', 'pageConfig'],
  mixins: [
    selectedItemMixin
  ],
  components: {
    baseTextInput
  }
}
</script>
