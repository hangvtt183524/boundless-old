<template lang="pug">
  base-button.email(
    :index="index"
    :config="config"
    :lang="lang"
    :default-lang="defaultLang"
    :selected-item="selectedItem"
    :class="selectedClass"
    @select="selectItem"
    :disable-remove="true"
  )
</template>

<script>
import selectedItemMixin from '../mixins/selected-item-mixin'
import baseButton from './button'

export default {
  props: ['index', 'config', 'lang', 'defaultLang', 'selectedItem', 'component'],
  mixins: [
    selectedItemMixin
  ],
  components: {
    baseButton
  }
}
</script>
