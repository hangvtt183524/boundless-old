<template lang="pug">
  .page-form.sponsor-code
    .sortable-container(ref="sortableContainer")
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
        @select="selectItem"
        class="sortable"
      )
</template>

<script>
import componentSelector from '../component-selector'
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

  components: {
    componentSelector
  },

  computed: {
    pageComponents () {
      return this.pageConfig.pages.ticketing.children
    }
  }
}
</script>
