<template lang="pug">
  base-button.email(
    :index="index"
    :config="config"
    :lang="lang"
    @click="$router.push('guest-form')"
  )
</template>

<script>
import baseButton from './button'

export default {
  props: ['index', 'config', 'lang'],
  components: {
    baseButton
  }
}
</script>
