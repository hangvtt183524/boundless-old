
let selectedItemWatchHtmlMixin = {
  computed: {
    parsedTitle () {
      let newTitle = this.translated.title || ''
      if (!this.config.linkColor) {
        this.config.linkColor = '#007bff'
      }
      newTitle = newTitle.replace(/<([^>]+)>/g, `<a class="link" href="#" style="color: rgba(${this.config.linkColor.rgba.r}, ${this.config.linkColor.rgba.g}, ${this.config.linkColor.rgba.b}, ${this.config.linkColor.rgba.a})">$1</a>`)
      return newTitle
    }
  },
  watch: {
    parsedTitle: function (newValue) {
      if (document.activeElement.tagName.toLowerCase() === 'iframe' && !this.selectedItem.updatedByBuildLink) {
        return
      }
      this.selectedItem.updatedByBuildLink = false
      this.$refs.contentEditable.innerHTML = newValue
    }
  },
  methods: {
    updateTitle (event) {
      try {
        if (!event || !event.target) {
          return
        }
        let updatedText = event.target.innerHTML
        updatedText = updatedText.replace(/<a[^>]*>/g, '<')
        updatedText = updatedText.replace(/<\/\s*a>/g, '>')
        updatedText = updatedText.replace(/&nbsp;/gi, ' ')
        updatedText = updatedText.replace(/[<]br[^>]*[>]/gi, '')
        this.translated.title = updatedText
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default selectedItemWatchHtmlMixin
