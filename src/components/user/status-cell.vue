<template lang='pug'>
  .user-status-cell
    span {{value? $t('general.pending'): $t('general.active')}}
    .pending-indicator(v-if="value")
</template>

<script>
export default {
  name: 'list-name-cell',
  props: {
    value: { // is_pending_invitation
      required: true
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import "../../styles/v2/colors";

  .user-status-cell {
    .pending-indicator {
      margin-left: 4px;
      margin-bottom: 7px;
      width: 4px;
      height: 4px;
      border-radius: 4px;
      background: #f2c94c;
      display: inline-block;
    }
  }
</style>
