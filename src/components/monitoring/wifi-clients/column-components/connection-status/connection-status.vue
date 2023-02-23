<template lang="pug">
  .connection-status-cell(
    :class="{'connection-status-cell--connected': value === true}"
  )
    v-tooltip(
      right
      :color="'#223d70'"
      light
    )
      template(v-slot:activator="{ on }")
        v-icon(
          :icon-color="value === true ? '#108112' : '#eb5757'"
          v-on="on"
        ) $vuetify.icons.connection
      span {{ value === true ? $t('general.online') : $t('general.offline') }}
</template>

<script>
export default {
  name: 'connection-status',
  props: {
    value: {
      required: true,
      type: Boolean
    },
    item: {
      type: Object
    }
  }
}
</script>

<style lang="scss" src="./connection-status.scss" scoped></style>
