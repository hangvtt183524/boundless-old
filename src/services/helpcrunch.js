
export default {
  setLanguage (language) {
    window.HelpCrunch('setPhraseList', language)
  },

  updateUser (user) {
    window.HelpCrunch('updateUser', user)
  },

  setCustomData (data) {
    window.HelpCrunch('updateUserData', data)
  },

  showWidget () {
    window.HelpCrunch('showChatWidget')

    this.setWidgetPosition()
    window.addEventListener('resize', this.onWindowResize.bind(this))
  },

  hideWidget () {
    window.HelpCrunch('hideChatWidget')

    window.removeEventListener('resize', this.setWidgetPosition)
  },

  onWindowResize () {
    // Hide the widget when user starts resizing, and show again at correct position after resize finish
    window.HelpCrunch('hideChatWidget')

    clearTimeout(this.onWindowResizeFinish)
    this.onWindowResizeFinish = setTimeout(() => {
      this.setWidgetPosition()
      window.HelpCrunch('showChatWidget')
    }, 250)
  },

  getButtonOffset () {
    // Get button offset value depending on window size
    const windowWidth = window.innerWidth
    if (windowWidth > 1024) {
      return windowWidth - 340
    } else if (windowWidth > 768) {
      return 0
    } else {
      return 265
    }
  },

  setWidgetPosition () {
    window.HelpCrunch('setChatButtonOffset', this.getButtonOffset(), 0)
  }
}
