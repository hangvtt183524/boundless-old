<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.selectLinkType') }}
    multiselect.mt-1.mb-3(
      :options="linkTypes",
      v-model="selectedType",
      :show-labels="false",
      label="text",
      :allow-empty="false"
    )
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object
    },
    link: {
      type: Object
    }
  },
  data () {
    return {
      selectedType: {
        text: 'Modal',
        value: 'modal'
      },
      linkTypes: [
        {
          text: this.$t('builder.modal'),
          value: 'modal'
        },
        {
          text: this.$t('builder.externalLink'),
          value: 'external_link'
        },
        {
          text: this.$t('builder.internalLink'),
          value: 'internal_link'
        }
      ]
    }
  },
  mounted () {
    if (this.link.type) {
      this.selectedType = this.linkTypes.find((l) => {
        return l.value === this.link.type
      })
    }
  },
  watch: {
    selectedType (val) {
      this.link.type = val.value
    }
  }
}
</script>
