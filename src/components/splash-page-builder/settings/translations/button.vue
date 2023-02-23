<template lang="pug">
  v-layout(row translation-type)
    v-flex(xs4)
      label.translation-label {{componentLabel}}
    v-flex(xs8)
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
