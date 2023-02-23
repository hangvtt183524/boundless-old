<template lang="pug">
  .page-form.guest-form
    .sortable-container(ref="sortableContainer")
      component(
        v-for="(component, index) in pageComponents"
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
        class="sortable"
        :sort-index="index"
        @select="selectItem"
      )
    component-selector(
      :show="showInputSelector"
      v-model="selectedInput"
      @toggle="showInputSelector = !showInputSelector"
      @add="addInput"
    )
</template>

<script>
import componentSelector from '../component-selector'
import pageMixin from '../../mixins/page-mixin'

export default {
  mixins: [
    pageMixin
  ],

  components: {
    componentSelector
  },
  data () {
    return {
      enableSorting: true
    }
  },

  computed: {
    pageComponents () {
      return this.pageConfig.pages.guestForm.children
    }
  }
}
</script>

<style>
.sortable-ghost {
  opacity: 0.4;
}

.sortable-drag {
  background: red;
}
</style>
