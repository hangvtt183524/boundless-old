<template lang="pug">
  .page-form.sponsor-page
    .sortable-container(ref="sortableContainer")
      component(
        v-for="component in pageComponents"
        :component="component"
        :is="componentMapper(component.component)"
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
      component-selector(
        :show="showInputSelector"
        v-model="selectedInput"
        @add="addInput"
        @toggle="showInputSelector = !showInputSelector"
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
      enableSorting: true
    }
  },

  components: {
    componentSelector
  },

  methods: {
    selectItem (item) {
      this.$emit('select', item)
    }
  },

  computed: {
    pageComponents () {
      return this.pageConfig.pages.smsRegistration.children
    }
  }
}
</script>
