<template lang="pug">
  .page-form.sponsor-auth
    component(
      v-for="component in pageComponents"
      :component="component"
      :is="component.component"
      :config="component.config"
      :lang="lang"
      :default-lang="defaultLang"
      :index="component.id"
      :key="component.id"
      :selected-item="selectedItem"
      :selected-page="selectedPage"
      :page-config="pageConfig"
      :disable-remove="true"
      @select="selectItem"
    )
</template>

<script>
import pageMixin from '../../mixins/page-mixin'

export default {
  mixins: [
    pageMixin
  ],

  data () {
    return {
      enableSorting: false
    }
  },

  computed: {
    pageComponents () {
      return this.pageConfig.pages.accessGrantedPage.children
    }
  }
}
</script>
