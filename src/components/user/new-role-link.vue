<template lang='pug'>
  .new-role-link
    a(
      @click='onClickNewRole'
    ) +{{ $t('v2.permissions.newRole') }}
</template>

<script>
export default {
  name: 'new-role-link',
  props: {
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data: function () {
    return {
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      }
    }
  },
  methods: {
    onClickNewRole () {
      if (this.mode === this.modes.internal) {
        this.$router.push({ name: 'NewInternalRole' })
      } else {
        this.$router.push({ name: 'NewRole' })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .new-role-link {
    display: inline-block;

    a {
      color: $green-medium;
      font-size: 16px;
      font-weight: normal;
      margin-left: 64px;
      text-decoration: underline;
    }
  }
</style>
