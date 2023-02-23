<template lang="pug">
  div
    h1 {{ $t('wifi.sponsors') }}
    v-container(grid-list-md)
      // top paragraph
      v-layout(row)
        v-flex(xs12)
          p {{ $t('etc.loremShort') }}

      // assignOneOrMoreEmails row
      v-layout.pt-5(row)
        v-flex(xs12)
          h4
            | {{ $t('wifi.assignOneOrMoreEmails') }}

      v-layout(row)
        v-flex(xs8, sm6)
          v-text-field(:label="$t('wifi.enterAnEmail')", ref='email', v-model='email')
        v-flex(xs4, sm1)
          v-btn(:loading='emailLoading', :disabled="email === '' || emailLoading", color='secondary', @click.native='verifyEmail(email)')
            | {{ $t('wifi.verify') }}

      v-layout(row, v-for="(e, idx) in emails", :key="idx")
        v-flex(xs48, sm6)
          v-text-field(:label="e" disabled)
        v-flex(xs4, sm1)
          v-icon(fab, dark, color='grey', @click='removeItemFromCollection(emails, idx)') close
      v-layout(row)
        v-flex(xs8, sm6)
          v-btn(:disabled="emailLastValid === ''", color='secondary', @click.native='addNewEmail(emailLastValid)')
            | {{ $t('wifi.addNewEmail') }}

      // assignOneOrMoreDomains row
      v-layout.pt-5(row)
        v-flex(xs12)
          h4
            | {{ $t('wifi.assignOneOrMoreDomains') }}

      v-layout(row)
        v-flex(xs8, sm6)
          v-text-field(:label="$t('wifi.domains')", ref='domain', v-model='domain')
        v-flex(xs4, sm1)
          v-btn(:loading='domainLoading', :disabled="domain === '' || domainLoading", color='secondary', @click.native='verifyDomain(domain)')
            | {{ $t('wifi.verify') }}

      v-layout(row, v-for="(d, idx) in domains", :key="idx")
        v-flex(xs48, sm6)
          v-text-field(:label="d" disabled)
        v-flex(xs4, sm1)
          v-icon(fab, dark, color='grey', @click='removeItemFromCollection(domains, idx)') close
      v-layout(row)
        v-flex(xs8, sm6)
          v-btn(:disabled="domainLastValid === ''", color='secondary', @click.native='addNewDomain(domainLastValid)')
            | {{ $t('wifi.addNewDomain') }}

      // allowWifiPersonalization row
      v-layout.pt-5(row)
        v-flex(xs12 sm4)
          h4 {{ $t(' wifi.allowWifiPersonalization ') }}
        v-flex(xs4 sm1)
          | {{ $t('general.yes') }}
        v-flex(xs4 sm1)
          v-switch(v-model="switch1", color="success")
        v-flex(xs4 sm1)
          | {{ $t('general.no') }}

      // wifiAvailabilityWindow row
      v-layout(row)
        v-flex(xs12 sm4)
          p {{ $t('wifi.wifiAvailabilityWindow') }}
        v-flex(xs4 sm1)
          | {{ $t('general.yes') }}
        v-flex(xs4 sm1)
          v-switch(v-model="switch1", color="success")
        v-flex(xs4 sm1)
          | {{ $t('general.no') }}

      // sessionDuration row
      v-layout(row)
        v-flex(xs12 sm4)
          p {{ $t('session.sessionDuration') }}
        v-flex(xs4 sm1)
          | {{ $t('general.yes') }}
        v-flex(xs4 sm1)
          v-switch(v-model="switch1", color="success")
        v-flex(xs4 sm1)
          | {{ $t('general.no') }}

      // accessWindow row
      v-layout(row)
        v-flex(xs12 sm4)
          p {{ $t('wifi.accessWindow') }}
        v-flex(xs4 sm1)
          | {{ $t('general.yes') }}
        v-flex(xs4 sm1)
          v-switch(v-model="switch1", color="success")
        v-flex(xs4 sm1)
          | {{ $t('general.no') }}

      // limitDownload row
      v-layout(row)
        v-flex(xs12 sm4)
          p {{ $t('wifi.limitDownload') }}
        v-flex(xs4 sm1)
          | {{ $t('general.yes') }}
        v-flex(xs4 sm1)
          v-switch(v-model="switch1", color="success")
        v-flex(xs4 sm1)
          | {{ $t('general.no') }}

      v-divider.my-5

      v-layout(row)
        v-flex.text-xs-right(xs12)
          v-btn(color="primary")
            | {{ $t('wifi.configureYourSponsorPage') }}

</template>

<script>
import { isEmail, isDomain } from '@/utils/functions'

export default {
  name: 'GuestWifiParametersSponsors',

  data () {
    return {
      switch1: false,

      email: '',
      emailLastValid: '',
      emails: [],
      emailLoading: false,

      domain: '',
      domainLastValid: '',
      domains: [],
      domainLoading: false
    }
  },

  methods: {
    addNewEmail (email) {
      this.emails.push(email)
      this.email = ''
      this.$refs.email.focus()
    },

    verifyEmail (email) {
      this.emailLoading = true
      setTimeout(() => {
        if (isEmail(email)) {
          this.emailLastValid = this.email
        } else {
          this.email = this.$t('wifi.emailIsInvalid')
        }
        this.emailLoading = false
      }, 1e3)
    },

    addNewDomain (domain) {
      this.domains.push(domain)
      this.domain = ''
      this.$refs.domain.focus()
    },

    verifyDomain (domain) {
      this.domainLoading = true
      setTimeout(() => {
        if (isDomain(domain)) {
          this.domainLastValid = this.domain
        } else {
          this.domain = this.$t('wifi.domainIsInvalid')
        }
        this.domainLoading = false
      }, 1e3)
    },

    removeItemFromCollection (arr, idx) {
      arr.splice(idx, 1)
    }
  }
}
</script>
