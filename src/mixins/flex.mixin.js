let FlexMixin = {
  methods: {
    flexClass (index) {
      let defaultClass = {}

      if (this.$vuetify.breakpoint.mdAndUp) {
        const even = (index + 1) % 2 === 0
        defaultClass = Object.assign({}, defaultClass, {
          'pr-2': !even,
          'pl-2': even
        })
      }
      return defaultClass
    }
  }
}

export default FlexMixin
