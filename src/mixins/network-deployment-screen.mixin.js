export default {
  methods: {
    jobMessageInfoFormatter (message) {
      if (message.code !== 'network_configuration_failure') {
        return message.extra_info
      }

      const messageInfo = JSON.parse(message.extra_info)

      const fieldName = this.$te(`v2.configurationCompliance.fields.${messageInfo.field}`)
        ? this.$t(`v2.configurationCompliance.fields.${messageInfo.field}`)
        : messageInfo.field

      let messageInfoHtml = `
        ${this.$t('v2.merakiClients.network')}: ${messageInfo.network}<br/>
        ${this.$t('general.field')}: ${fieldName}<br/>
      `

      Object.entries(messageInfo).forEach(([key, value]) => {
        if (key === 'network' || key === 'field') {
          // We have already set these fields
          return
        }

        messageInfoHtml += `${this.$t('v2.merakiTemplates.messageInfoFieldTypes.' + key)}: ${value}<br/>`
      })

      return messageInfoHtml
    }
  }
}
