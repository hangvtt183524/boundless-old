<template lang="pug">
  .page-form.sponsor-auth
    logo(
      :page-config="pageConfig"
      :config="pageConfig.logo.config"
      v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
    )
    component(
      v-for="component in selectedPageInfo.children"
      :is="componentMapper(component.component)"
      :config="component.config"
      :lang="lang"
      :index="component.id"
      :key="component.id"
      :page-config="pageConfig"
      :page-params="pageParams"
      :component-name="component.component"
    )
</template>

<script>
import heading from '../../components/heading'
import submitButton from '../../components/submit-button'
import pageMixin from '../../mixins/page-mixin'

export default {
  props: {
    pageConfig: {
      type: Object,
      required: true
    },
    lang: {
      type: String
    },
    pageParams: {
      type: Object,
      required: true
    }
  },

  mixins: [
    pageMixin
  ],

  components: {
    heading,
    submitButton
  },

  data () {
    return {
      pageKey: 'wifiUnavailablePage'
    }
  }
}
</script>
