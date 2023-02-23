
let SelectedItemWatchTextMixin = {
  computed: {
    translatedTitle () {
      return this.translated && this.translated.title
    }
  },
  watch: {
    translatedTitle: function (newValue) {
      if (document.activeElement.tagName.toLowerCase() === 'iframe') {
        return
      }
      this.$refs.contentEditable.innerHTML = newValue
    }
  },
  methods: {
    updateTitle (event) {
      try {
        if (!event || !event.target) {
          return
        }
        this.translated.title = event.target.innerText
      } catch (err) {
        console.error(err)
      }
    }
  }
}

export default SelectedItemWatchTextMixin
