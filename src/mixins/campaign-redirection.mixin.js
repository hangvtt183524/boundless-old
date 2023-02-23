import { url } from 'vuelidate/lib/validators'

let CampaignRedirectionMixin = {
  methods: {
    selectMode (mode) {
      this.$set(this.value, 'redirection_mode', mode.value)
      this.$emit('input', this.value)

      // scroll to specific section on type select
      this.$nextTick(() => {
        let el
        switch (mode.value) {
          case 'connection_mode':
            el = this.$refs.connectionMode.$el
            break
          case 'device_type':
            el = this.$refs.mobileMode.$el
            break
          case 'scenario':
            el = this.$refs.scenarioMode.$el
            break
        }
        this.$el.closest('.dialog').scrollTop = el.scrollHeight
      })
    },
    isConditionalModeValid (conditionals, redirectionType) {
      let hasValue = false
      for (let item of conditionals) {
        let fieldName = `redirection_url_${redirectionType}_${item}`
        if (this.value[fieldName]) {
          hasValue = true
          if (!url(this.value[fieldName])) {
            return false
          }
        }
      }
      return hasValue
    },
    isConnectionModeValid () {
      const conditionals = [
        'form',
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'google'
      ]
      return this.isConditionalModeValid(conditionals, 'auth')
    },
    isMobileModeValid () {
      const conditionals = [
        'default'
      ]
      return this.isConditionalModeValid(conditionals, 'device')
    },
    isScenarioModeValid () {
      for (let item of this.value.scenarios) {
        if (!item.redirectUrl || !url(item.redirectUrl)) {
          return false
        }
      }
      return true
    },
    isConditionalValid () {
      if (this.value.redirection_mode === 'connection_mode') {
        return this.isConnectionModeValid()
      } else if (this.value.redirection_mode === 'device_type') {
        return this.isMobileModeValid()
      } else if (this.value.redirection_mode === 'scenario') {
        return this.isScenarioModeValid()
      } else {
        return false
      }
    }
  }
}

export default CampaignRedirectionMixin
