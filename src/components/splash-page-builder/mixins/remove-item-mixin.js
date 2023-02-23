
let RemoveItemMixin = {

  methods: {
    removeInput () {
      try {
        let index = this.pageConfig.pages[this.selectedPage.configKey].children.findIndex((child) => child.id === this.component.id)

        if (index > -1) {
          this.pageConfig.pages[this.selectedPage.configKey].children.splice(index, 1)
        }
      } catch (error) {
        console.error(error)
      }
    },
    removeLogo () {
      try {
        this.pageConfig.pages[this.selectedPage.configKey].logo.config.hidden = true
      } catch (error) {
        console.error(error)
      }
    }
  }

}

export default RemoveItemMixin
