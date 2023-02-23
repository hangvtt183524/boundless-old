<template lang="pug">
  base-button.email(
    :index="index",
    :config="config",
    :lang="lang"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('submit')"
  )
</template>

<script>
import baseButton from './button'

export default {
  props: ['index', 'config', 'lang', 'loading', 'disabled'],
  components: {
    baseButton
  }
}
</script>
