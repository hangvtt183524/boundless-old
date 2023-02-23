<template lang="pug">
  v-container(grid-list-md)
    // top paragraph
    .sponsors(data-test="sponsors")
      v-layout
        v-flex(xs12, sm12, md6, lg6)
          h2 {{ $t(' wifi.addSponsors ') }}
        v-flex.pb-3(xs6, md6, lg6, text-xs-right)
          v-btn.primary-action(
            data-test="btn-save"
            color='primary'
            :disabled="loading || !changedState"
            @click.stop='submitWifiSponsors'
          )
            | {{ $t('general.save') }}
            v-icon save

      // sponsor inputs
      v-layout(row)
        v-flex.py-4.mr-2(xs12 sm6)
          v-layout(row)
            v-flex(xs12, class="input-wrap")
              h3.small-heading.mb-3 {{ $t('wifi.assignOneOrMoreEmails') }}
          .form-card.round(data-test="assign-blocked-emails-form")
            v-layout(row).mb-3
              v-flex(xs8, sm6)
                v-text-field.email-input(
                  data-test="email-input"
                  :label="$t('wifi.enterAnEmail')"
                  ref='email'
                  v-model='email'
                  :counter="emailMaxLength"
                  :error-messages="emailErrors"
                  @blur="$v.email.$touch"
                  @input="delayTouch($v.email)"
                  @keyup.enter='addEmail(email)'
                )
              v-flex.text-xs-right.pt-2(xs4, sm6)
                v-btn(
                  data-test="btn-add-email"
                  :loading='emailLoading'
                  :disabled="emailDisabled"
                  color='success'
                  round
                  :outline='!emailDisabled'
                  @click.native='addEmail(email)'
                )
                  | {{ $t('wifi.addEmail') }}
            .added-emails(data-test="added-emails")
              .added-email(data-test="added-email" v-for="(value, index) in emails", :key="index")
                v-layout.mt-2(row)
                  .item-row
                    .item-text {{ value.email }}
                    .item-action
                      v-btn.divider-vert.mx-0(icon, tabindex='-1' data-test="btn-delete" @click="removeItemFromCollection(emails, index)")
                        v-icon(small, color='grey') close

        v-flex.py-4.ml-2(xs12 sm6)
          v-layout(row)
            v-flex(xs12, class="input-wrap")
              h3.small-heading.mb-3 {{ $t('wifi.assignOneOrMoreDomains') }}
          .form-card.round(data-test="assign-domains-form")
            v-layout(row).mb-3
              v-flex(xs8, sm6)
                v-text-field.domain-input(
                  data-test="domain-input"
                  :label="$t('wifi.domains')"
                  ref='domain'
                  v-model='domain'
                  :counter="domainMaxLength"
                  :error-messages="domainErrors"
                  @input="delayTouch($v.domain)"
                  @blur="$v.domain.$touch"
                  @keyup.enter='addDomain(domain)'
                )
              v-flex.text-xs-right.pt-2(xs4, sm6)
                v-btn(
                  data-test="btn-add-domain"
                  :loading='domainLoading'
                  :disabled='domainDisabled'
                  color='success'
                  round
                  :outline='!domainDisabled'
                  @click.native='addDomain(domain)')
                  | {{ $t('wifi.addDomain') }}

            .added-domains(data-test="added-domains")
              .added-domain(data-test="added-domain" v-for="(value, index) in domains", :key="index")
                v-layout.mt-2(row)
                  .item-row
                    .item-text {{ value.domain }}
                    .item-action
                      v-btn.divider-vert.mx-0(icon, tabindex='-1', data-test="btn-delete" @click="removeItemFromCollection(domains, index)")
                        v-icon(small, color='grey') close

      v-layout(row)
        v-flex.py-4.mr-2(xs12 sm6)
          v-layout(row)
            v-flex(xs12, class="input-wrap")
              h3.small-heading.mb-3 {{ $t('wifi.blockSponsorEmails') }}
          .form-card.round(data-test="assign-emails-form")
            v-layout(row).mb-3
              v-flex(xs8, sm6)
                v-text-field.email-input(
                  data-test="email-input"
                  :label="$t('wifi.enterAnEmail')"
                  ref='blockedEmail'
                  v-model='blockedEmail'
                  :counter="emailMaxLength"
                  :error-messages="blockedEmailErrors"
                  @blur="$v.blockedEmail.$touch"
                  @input="delayTouch($v.blockedEmail)"
                  @keyup.enter='addBlockEmail(blockedEmail)'
                )
              v-flex.text-xs-right.pt-2(xs4, sm6)
                v-btn(
                  data-test="btn-add-email"
                  :loading='blockedEmailLoading'
                  :disabled="blockedEmailDisabled"
                  color='success'
                  round
                  :outline='!emailDisabled'
                  @click.native='addBlockEmail(blockedEmail)'
                )
                  | {{ $t('wifi.addEmail') }}
            .added-emails(data-test="added-emails")
              .added-email(data-test="added-email" v-for="(value, index) in blockedEmails", :key="index")
                v-layout.mt-2(row)
                  .item-row
                    .item-text {{ value.email }}
                    .item-action
                      v-btn.divider-vert.mx-0(icon, tabindex='-1' data-test="btn-delete" @click="removeItemFromCollection(blockedEmails, index)")
                        v-icon(small, color='grey') close

      v-layout(row)
        v-flex.py-4.mr-2(xs12 sm6)
          v-layout(row)
            v-flex(xs12, class="input-wrap")
              h3.small-heading.mb-3 {{ $t('wifi.confirmByEmail') }}
            base-switch(
              data-test="enable-switch"
              color="deep-purple lighten-2"
              v-model="enableMailConfirm"
            )
          .form-card.round(data-test="mail-confirm-form" :class="{ disabled: !enableMailConfirm }" disabled="!enableMailConfirm")
            v-layout(row).mb-6
              v-flex.mr-4(xs12 sm6, class="input-wrap")
                v-text-field.mail-from(
                  data-test="mail-from"
                  :label="$t('wifi.senderName')"
                  ref='mailFrom'
                  :error-messages="getErrorsForMail(mailFrom)"
                  v-model='mailFrom'
                  :disabled="!enableMailConfirm"
                )
              v-flex.ml-4(xs12 sm6, class="input-wrap")
                v-text-field.mail-subject(
                  data-test="mail-subject"
                  :label="$t('wifi.subject')"
                  ref='mailSubject'
                  v-model='mailSubject'
                  :error-messages="getErrorsForMail(mailSubject)"
                  :disabled="!enableMailConfirm"
                )
            v-layout(row wrap).mb-6
              v-text-field(
                data-test="contact-us-message"
                :label="$t('wifi.confirmMessage')"
                name="mail-body"
                textarea
                v-model='mailBody'
                :error-messages="getErrorsForMail(mailBody)"
                :disabled="!enableMailConfirm"
              )
        v-flex.py-4.mr-2(xs12 sm6)
          v-layout(row)
            v-flex(xs12, class="input-wrap")
              h3.small-heading.mb-3 {{ $t('wifi.confirmBySMS') }}
            base-switch(
              data-test="enable-switch"
              color="deep-purple lighten-2"
              v-model="enalbeSMS"
            )
          .form-card.round(data-test="assign-emails-form" :class="{ disabled: !enalbeSMS }" disabled="!enalbeSMS")
            v-layout(row).mb-3
              v-flex
                v-text-field.message-input(
                  data-test="message-input"
                  :label="$t('wifi.confirmMessage')"
                  ref='smsMessage'
                  v-model='smsMessage'
                  :error-messages="smsMessageError"
                  counter
                  maxlength="45"
                  :disabled="!enalbeSMS"
                )
      v-layout(row)
        v-flex.py-4.mr-2(xs12 sm6)
          v-layout(row)
            v-flex(xs12, class="input-wrap")
              h3.small-heading.mb-3 {{ $t('wifi.sponsorAuthorizationEmail') }}
          .form-card.round(data-test="mail-authorize-form" )
            v-layout(row).mb-6
              v-flex.mr-4(xs12 sm6, class="input-wrap")
                v-text-field.mail-from(
                data-test="mail-from"
                :label="$t('wifi.senderName')"
                ref='authorizationMailFrom'
                :error-messages="getErrorsForAuthorizationMail(authorizationMailFrom, 'sender')"
                v-model='authorizationMailFrom'
                )
              v-flex.ml-4(xs12 sm6, class="input-wrap")
                v-text-field.mail-subject(
                data-test="mail-subject"
                :label="$t('wifi.subject')"
                ref='authorizationMailSubject'
                v-model='authorizationMailSubject'
                :error-messages="getErrorsForAuthorizationMail(authorizationMailSubject, 'subject')"
                )
            v-layout(row wrap).mb-6
              v-text-field(
              data-test="contact-us-message"
              :label="$t('wifi.authorizeMessage')"
              name="mail-body"
              textarea
              v-model='authorizationMailBody'
              :error-messages="getErrorsForAuthorizationMail(authorizationMailBody, 'body')"
              )

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'
import { NODE_LIST_CHANGE_EVENT } from '@/constants/events'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

const emailUnique = (value, component) => {
  const list = component.emails.map(v => v.email)
  return !list.includes(value)
}

const emailMaxLength = (value) => {
  return value.length <= 254
}

const domainUnique = (value, component) => {
  const list = component.domains.map(v => v.domain)
  return !list.includes(value)
}

const domainMaxLength = (value) => {
  return value.length <= 256
}

export default {
  name: 'WifiConfigurationSponsors',
  mounted () {
    if (this.selectedNode.id) {
      this.getSponsorsData()
    }
  },
  data () {
    return {
      email: '',
      emailLastValid: '',
      emails: [],
      emailLoading: false,

      blockedEmail: '',
      blockedEmails: [],
      blockedEmailLoading: false,

      domain: '',
      domainLastValid: '',
      domains: [],
      domainLoading: false,
      domainValid: false,
      originalData: {},
      loading: false,

      enableMailConfirm: false,
      mailFrom: '',
      mailSubject: '',
      mailBody: '',

      authorizationMailFrom: '',
      authorizationMailSubject: '',
      authorizationMailBody: '',

      enalbeSMS: false,
      smsMessage: '',

      emailMaxLength: 254,
      domainMaxLength: 256
    }
  },

  validations: {
    email: {
      required,
      email,
      emailUnique,
      emailMaxLength
    },
    blockedEmail: {
      required,
      email,
      emailUnique,
      emailMaxLength
    },
    domain: {
      required,
      domainUnique,
      domainMaxLength
    },
    smsMessage: {
      required
    }
  },

  computed: {
    ...mapGetters('layout', ['selectedOrganization', 'selectedNode', 'userOrganizationNodes']),
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push(this.$t('general.emailValid'))
      !this.$v.email.emailUnique && errors.push(this.$t('general.sponsorEmailUnique', { email: this.email }))
      !this.$v.email.emailMaxLength && errors.push(this.$t('general.maxCharacters', { count: this.emailMaxLength }))

      return errors
    },
    blockedEmailErrors () {
      const errors = []
      if (!this.$v.blockedEmail.$dirty) return errors
      !this.$v.blockedEmail.email && errors.push(this.$t('general.emailValid'))
      !this.$v.blockedEmail.emailUnique && errors.push(this.$t('general.sponsorEmailUnique', { blockedEmail: this.blockedEmail }))
      !this.$v.blockedEmail.emailMaxLength && errors.push(this.$t('general.maxCharacters', { count: this.emailMaxLength }))

      return errors
    },
    domainErrors () {
      const errors = []
      if (!this.$v.domain.$dirty) return errors
      !this.validDomain() && errors.push(`${this.$t('general.domainValid')}`)
      !this.$v.domain.domainUnique && errors.push(`${this.$t('general.sponsorDomainUnique', { domain: this.domain })}`)
      !this.$v.domain.domainMaxLength && errors.push(this.$t('general.maxCharacters', { count: this.domainMaxLength }))

      return errors
    },
    smsMessageError () {
      const errors = []
      !this.smsMessage && this.enalbeSMS && errors.push(`${this.$t('errors.required')}`)
      return errors
    },
    emailDisabled () {
      return this.email === '' || this.emailLoading || this.$v.email.$invalid
    },
    blockedEmailDisabled () {
      return this.blockedEmail === '' || this.blockedEmailLoading || this.$v.blockedEmail.$invalid
    },
    domainDisabled () {
      return this.domain === '' || this.domainLoading || !this.domainValid || !this.$v.domain.domainUnique
    },
    changedState () {
      if (!global._.isEqual(this.originalData.emails || [], this.emails) ||
        !global._.isEqual(this.originalData.blockedEmails || [], this.blockedEmails) ||
        !global._.isEqual(this.originalData.domains || [], this.domains) ||
        (this.enableMailConfirm !== this.originalData.confirmation_email_enabled) ||
        (this.enalbeSMS !== this.originalData.confirmation_sms_enabled) ||
        !global._.isEqual(this.originalData.confirmation_email_settings, {
          mail_from: this.mailFrom,
          mail_subject: this.mailSubject,
          mail_body: this.mailBody
        }) ||
        !global._.isEqual(this.originalData.authorization_email_settings, {
          mail_from: this.authorizationMailFrom,
          mail_subject: this.authorizationMailSubject,
          mail_body: this.authorizationMailBody
        }) ||
        !global._.isEqual(this.originalData.confirmation_sms_settings, {
          message: this.smsMessage
        })) {
        return true
      }
      return false
    }
  },

  watch: {
    domain (v) {
      this.validDomain()
    },
    selectedNode (newValue, oldValue) {
      this.getSponsorsData()
    },
    enableMailConfirm (newValue) {
      if (newValue) {
        this.mailFrom = this.mailFrom || this.$t('wifi.wifiAccess')
        this.mailSubject = this.mailSubject || this.$t('wifi.wifiAccessCodes')
        this.mailBody = this.mailBody || this.$t('wifi.wifiAccessCodesInputNotify')
      }
    },
    enalbeSMS (newValue) {
      if (newValue) {
        this.smsMessage = this.smsMessage || this.$t('wifi.wifiAccessCodesInputNotify')
      }
    }
  },

  methods: {
    ...mapActions('organization/node', ['updateNode']),
    getSponsorsData () {
      const wifiConfigSponsor = this.selectedNode.wifi_config_sponsor || {
        confirmation_email_enabled: true,
        authorization_email_settings: {
          mail_from: this.$t('wifi.defaultAuthorizationMailFrom'),
          mail_subject: this.$t('wifi.defaultAuthorizationMailSubject'),
          mail_body: this.$t('wifi.defaultAuthorizationMailBody')
        }
      }
      this.emails = Object.assign([], wifiConfigSponsor.emails)
      this.blockedEmails = Object.assign([], wifiConfigSponsor.blacklisted_emails)
      this.domains = Object.assign([], wifiConfigSponsor.domains)

      this.enableMailConfirm = wifiConfigSponsor.confirmation_email_enabled || false
      const confirmationEmailSettings = wifiConfigSponsor.confirmation_email_settings || {}
      this.mailFrom = confirmationEmailSettings.mail_from || ''
      this.mailSubject = confirmationEmailSettings.mail_subject || ''
      this.mailBody = confirmationEmailSettings.mail_body || ''

      const authorizationEmailSettings = wifiConfigSponsor.authorization_email_settings || {}
      this.authorizationMailFrom = authorizationEmailSettings.mail_from || ''
      this.authorizationMailSubject = authorizationEmailSettings.mail_subject || ''
      this.authorizationMailBody = authorizationEmailSettings.mail_body || ''

      this.enalbeSMS = wifiConfigSponsor.confirmation_sms_enabled || false
      const confirmationSmsSettings = wifiConfigSponsor.confirmation_sms_settings || {}
      this.smsMessage = confirmationSmsSettings.message || ''

      this.loading = false
      this.domain = ''
      this.email = ''

      this.originalData = {
        emails: Object.assign([], wifiConfigSponsor.emails),
        blockedEmails: Object.assign([], wifiConfigSponsor.blacklisted_emails),
        domains: Object.assign([], wifiConfigSponsor.domains),
        confirmation_email_enabled: this.enableMailConfirm,
        confirmation_email_settings: {
          mail_from: this.mailFrom,
          mail_subject: this.mailSubject,
          mail_body: this.mailBody
        },
        confirmation_sms_enabled: this.enalbeSMS,
        confirmation_sms_settings: {
          message: this.smsMessage
        },
        authorization_email_settings: {
          mail_from: this.authorizationMailFrom,
          mail_subject: this.authorizationMailSubject,
          mail_body: this.authorizationMailBody
        }
      }
    },
    getErrorsForMail (value) {
      const errors = []
      !value && this.enableMailConfirm && errors.push(`${this.$t('errors.required')}`)
      return errors
    },
    getErrorsForAuthorizationMail (value, field) {
      const errors = []
      !value && errors.push(`${this.$t('errors.required')}`)

      // Check interpolations for mail body
      field === 'body' && !errors.length &&
      !(value.indexOf('{first_name}') > -1 && value.indexOf('{last_name}') > -1 && value.indexOf('{email}') > -1) &&
      errors.push(`${this.$t('wifi.authorizationMailBodyMissingInterpolationMessage')}`)

      return errors
    },
    addEmail (email) {
      if (!this.$v.email.$invalid) {
        this.emails.push({ email })
        this.email = ''
        this.$v.email.$reset()
        this.$refs.email.focus()
      }
    },
    addBlockEmail (email) {
      if (!this.$v.blockedEmail.$invalid) {
        this.blockedEmails.push({ email })
        this.blockedEmail = ''
        this.$v.blockedEmail.$reset()
        this.$refs.blockedEmail.focus()
      }
    },
    addDomain (domain) {
      if (this.domainValid && !this.$v.domain.$invalid) {
        this.domains.push({ domain })
        this.domain = ''
        this.domainValid = false
        this.$v.domain.$reset()
        this.$refs.domain.focus()
      }
    },

    removeItemFromCollection (arr, idx) {
      arr.splice(idx, 1)
    },

    validDomain () {
      if (this.domain === '') {
        this.domainValid = true
      } else {
        let exp = /^[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/i
        let valid = exp.test(this.domain)
        this.domainValid = valid
      }
      return this.domainValid
    },
    submitWifiSponsors () {
      if (this.enableMailConfirm && !(this.mailBody && this.mailSubject && this.mailFrom)) return
      if (this.enalbeSMS && !this.smsMessage) return
      if (!(this.authorizationMailBody && this.authorizationMailSubject && this.authorizationMailFrom) ||
        !(this.authorizationMailBody.indexOf('{first_name}') > -1 && this.authorizationMailBody.indexOf('{last_name}') > -1 &&
          this.authorizationMailBody.indexOf('{email}') > -1)) return

      let wifiConfigSponsor = {
        emails: this.emails,
        domains: this.domains,
        blacklisted_emails: this.blockedEmails,
        confirmation_email_enabled: this.enableMailConfirm,
        confirmation_sms_enabled: this.enalbeSMS,
        authorization_email_settings: {
          mail_from: this.authorizationMailFrom,
          mail_subject: this.authorizationMailSubject,
          mail_body: this.authorizationMailBody
        }
      }

      if (this.enableMailConfirm) {
        wifiConfigSponsor.confirmation_email_settings = {
          mail_from: this.mailFrom,
          mail_subject: this.mailSubject,
          mail_body: this.mailBody
        }
      }

      if (this.enalbeSMS) {
        wifiConfigSponsor.confirmation_sms_settings = {
          message: this.smsMessage
        }
      }

      this.loading = true
      this.updateNode({ nodeId: this.selectedNode.id, wifi_config_sponsor: wifiConfigSponsor }).then(response => {
        global.toastr['success'](this.$t('wifi.savedSponsor'), this.$t('general.success'))
        this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)

        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.SPONSOR_LIST_MODIFIED)
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-card p {
    color: #9ba9c4;
    font-size: 14px;
    margin: 0;
  }

  .item-row {
    display: flex;
    padding: 10px 20px;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    background-color: #f8fafc;
    border-radius: 5px;

    .item-text {
      color: #00082a;
      width: calc(100% - 40px);
      overflow-wrap: break-word;
    }

  }

  .v-text-field:not(.search-input):not(.v-textarea) {
    // Override default style that defines a fixed height in custom.css
    height: auto;
  }

  .label-help {
    top: -9px !important;
  }
</style>
