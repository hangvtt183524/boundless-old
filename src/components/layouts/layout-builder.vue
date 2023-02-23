<template lang='pug'>
  v-app.builder-app
    router-view
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NodeSelectionsMixin from '@/mixins/node-selections.mixin'
export default {
  name: 'LayoutBuilder',
  mixins: [NodeSelectionsMixin],
  mounted () {
    document.body.classList.add('auth')
    this.bootstrap().then(() => {
      // Fetch user roles for permission checks
      this.$store.dispatch('user/fetchUserRoles', this.currentUser.id)
        .catch(() => {
          this.loading = false
        })
        .finally(() => {
          this.loading = false
        })

      // Set selected organization if not set, for permission checks
      if (!(this.selectedOrganization && this.selectedOrganization.id)) {
        this.selectOrganization({ id: Number.parseInt(this.$route.params.orgId) })
        this.selectNode({ id: Number.parseInt(this.$route.params.nodeId) })
      }
    })
  },
  beforeDestroy () {
    document.body.classList.remove('auth')
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('layout', ['selectedOrganization'])
  },
  methods: {
    ...mapActions(['bootstrap'])
  },
  watch: {
    currentUser (user) {
      if (user && user.profile && user.profile.language) {
        this.$i18n.locale = user.profile.language
      }
    }
  }
}
</script>
