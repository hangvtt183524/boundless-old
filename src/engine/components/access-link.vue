<template lang="pug">
  base-link.email-input(
    :index="index"
    :config="config"
    :lang="lang"
  )
</template>

<script>
import baseLink from './link'

export default {
  props: ['index', 'config', 'lang'],
  components: {
    baseLink
  }
}
</script>
