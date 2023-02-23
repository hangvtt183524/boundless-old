<template lang="pug">
  base-button.social(
    :index="index"
    :config="config"
    :lang="lang"
    :default-lang="defaultLang"
    :component="component"
    :selected-item="selectedItem"
    :selected-page="selectedPage"
    :page-config="pageConfig"
    @select="selectItem"
  )
</template>

<script>
import baseButton from './button'
import selectedItemMixin from '../mixins/selected-item-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang', 'selectedItem', 'selectedPage', 'pageConfig', 'component'],
  mixins: [
    selectedItemMixin
  ],
  components: {
    baseButton
  }
}
</script>
