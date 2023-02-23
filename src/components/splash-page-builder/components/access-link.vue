<template lang="pug">
  base-link.email-input(
    :index="index",
    :config="config",
    :lang="lang"
    :default-lang="defaultLang"
    :component="component"
    :selected-item="selectedItem",
    :selected-page="selectedPage"
    :page-config="pageConfig"
    :disable-remove="true"
    @select="selectItem"
  )
</template>

<script>
import baseLink from './link'
import selectedItemMixin from '../mixins/selected-item-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang', 'selectedItem', 'component', 'pageConfig', 'selectedPage'],
  mixins: [
    selectedItemMixin
  ],
  components: {
    baseLink
  }
}
</script>
