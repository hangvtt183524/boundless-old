<template lang="pug">
  v-layout(row translation-type)
      v-flex(xs4)
        label.translation-label {{componentLabel}}
      v-flex(xs8)
        input.form-control(v-model="translated.label")
        v-layout(row)
          v-flex(xs2 v-for="(link, index) in translated.links" :key="index")
            v-btn(@click.prevent="showCGUModal=true;", v-if="link.type === 'modal'") Modal Content
            base-dialog(
              :persistent="true"
              :show="showCGUModal"
              @close="closeCGUModal"
              max-width="920"
            )
              link-modal(@close="closeCGUModal" :link="link", v-if="link && link.type === 'modal'" :key="lang")
</template>

<script>
import translationMixin from '../../mixins/translation-mixin'
import linkModal from '../../option-types/link/link-modal'

export default {
  props: ['index', 'config', 'component', 'lang', 'defaultLang'],
  mixins: [
    translationMixin
  ],
  components: {
    linkModal
  },
  data () {
    return {
      showCGUModal: false
    }
  },
  methods: {
    closeCGUModal () {
      this.showCGUModal = false
    }
  }
}
</script>
