<template lang="pug">
  .page-component.heading
    p(
      :style="paragraphStyle"
      :class="wrapClass"
    )
      span(
        :style="textStyle"
      ) {{translated.title}}
</template>

<script>
import commonStyles from '../mixins/component-common-styles'
import componentStyles from '../mixins/component-styles/text-paragraph'
import translationMixin from '../mixins/translation-mixin'

export default {
  props: ['index', 'config', 'lang', 'defaultLang'],
  mixins: [
    commonStyles,
    componentStyles,
    translationMixin
  ]
}
</script>
