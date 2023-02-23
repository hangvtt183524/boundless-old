<template lang="pug">
  v-layout(row translation-type)
    v-flex(xs4)
      label.translation-label {{componentLabel}}
    v-flex(xs8)
      input.form-control(
        v-if="config.showLabel"
        v-model="translated.label"
      )
      input.form-control(v-model="translated.placeholder")
      .option-type
        label.option-label Options
        .options-container
          .translation-select-option(v-for="(option, optIndex) in config.options")
            input(
              type="text",
              v-model="config.options[optIndex].translation[lang].label",
              class="form-control mt-2",
              @focus="focused = optIndex",
              @blur="focused = -1"
              placeholder="Label"
            )
            //- input(
            //-   type="text",
            //-   v-model="config.options[optIndex].value",
            //-   class="form-control mt-2",
            //-   @focus="focused = optIndex",
            //-   @blur="focused = -1"
            //-   placeholder="Value"
            //- )
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
