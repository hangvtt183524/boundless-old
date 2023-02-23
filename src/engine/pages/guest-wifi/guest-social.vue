<template lang="pug">
  .page-form.guest-social
    logo(
      :page-config="pageConfig"
      :config="pageConfig.logo.config"
      v-if="!selectedPageInfo.logo || !selectedPageInfo.logo.config || !selectedPageInfo.logo.config.hidden"
    )
    .alert.alert-danger(role="alert", v-if="showError", v-cloak) {{ translatedErrorMessage }}
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

import pageMixin from '../../mixins/page-mixin'

export default {
  props: {
    pageConfig: {
      type: Object,
      required: true
    },
    pageParams: {
      type: Object,
      required: true
    },
    lang: {
      type: String
    }
  },

  data () {
    return {
      showError: false,
      errorMessage: 'engine.errorServer',
      pageKey: 'guestSocial'
    }
  },

  mixins: [
    pageMixin
  ],

  methods: {

  }
}
</script>
