<template lang="pug">
  .page-form.guest-social
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
        :disable-remove="true"
        @select="selectItem"
        class="sortable"
      )
    component-selector(
      :show="showInputSelector"
      v-model="selectedInput"
      @toggle="showInputSelector = !showInputSelector"
      @add="addInput"
    )
</template>

<script>
import pageMixin from '../../mixins/page-mixin'
import componentSelector from '../component-selector'

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
      return this.pageConfig.pages.guestSocial.children
    }
  }
}
</script>
