<template lang="pug">
  .option-type
    label.option-label.font-weight-bold.subheading {{$t('builder.externalLink')}}
    input.form-control.mb-5(type="text", v-model="link.externalUrl", placeholder="http://ivizone.com")
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
  }
}
</script>
