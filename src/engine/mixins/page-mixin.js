import components from '../components'

let PageMixin = {
  components,
  computed: {
    selectedPageInfo () {
      return this.pageConfig.pages[this.pageKey]
    }
  },
  methods: {
    componentMapper (componentName) {
      let socialButtons = [
        'facebook-button',
        'instagram-button',
        'google-button',
        'linkedin-button',
        'twitter-button'
      ]
      if (socialButtons.indexOf(componentName) !== -1) {
        return 'social-button'
      }
      return componentName
    }
  }
}

export default PageMixin
