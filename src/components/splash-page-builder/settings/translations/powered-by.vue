<template lang="pug">
  v-layout(row translation-panel)
    input.form-control(v-model="translated.title")
</template>

<script>
import translationMixin from '../../mixins/translation-mixin'
export default {
  props: ['index', 'config', 'component', 'lang', 'defaultLang'],
  mixins: [
    translationMixin
  ]
}
</script>
