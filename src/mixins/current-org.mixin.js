import { mapGetters } from 'vuex'

const CurrentOrgMixin = {
  data () {
    return {
      orgLoadedCallback: null
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    orgId () {
      return this.selectedOrganization.id
    }
  },
  methods: {
    setOrgLoadedCallback (method) {
      this.orgLoadedCallback = method
      if (this.orgId) {
        this.orgLoadedCallback(this.orgId)
      } else {
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'organization/SELECT_ORGANIZATION') {
            if (this.orgId) {
              this.orgLoadedCallback(this.orgId)
            }
          }
        })
      }
    }
  },
  watch: {
    orgId (newValue) {
      if (this.orgLoadedCallback) {
        this.orgLoadedCallback(newValue)
      }
    }
  }
}

export default CurrentOrgMixin
