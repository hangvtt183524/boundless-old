<template lang="pug">
  v-container
    // page title
    v-layout(row)
      v-flex.py-5(xs12)
        h1 {{ $t(' contact.contactUs') }}
        hr.my-3
        p {{ $t(' contact.fillTheContactForm') }}

    // contact row
    v-layout(row)
      v-flex(xs12 sm6)
        v-select.mr-3(:items='polites', v-model='polite', :label="$t('general.polite')", single-line, required)
        v-text-field.mr-3(:name="$t('general.firstName')", :label="$t('general.firstName')", required)
        v-text-field.mr-3(:name="$t('general.lastName')", :label="$t('general.lastName')", required)
        v-text-field.mr-3(:name="$t('general.email')", :label="$t('general.email')", required)
        v-text-field.mr-3(:name="$t('general.address')", :label="$t('general.address')")
      v-flex(xs12 sm6)
        v-text-field.ml-3(:name="$t('general.phoneNumber')", :label="$t('general.phoneNumber')", required)
        v-select.ml-3(:items='subjects', v-model='subject', :label="$t('general.subject')", single-line, required)
        v-text-field.ml-3(v-model='message', :name="$t('contact.writeMessageHere')", :label="$t('contact.writeMessageHere')", row-height
        ="40" counter="500", :rules="maxMessageSize", box, textarea, required)
    v-layout.pt-5(row)
      v-flex(xs12)
        em {{ $t('contact.mandatoryFields') }}
    v-layout.pt-5.text-xs-right(row)
      v-flex(xs12)
        v-btn(dark, color="indigo") {{$t('general.send')}}
</template>

<script>
import { maxCharCount } from '@/utils/form-fields-validation-rules'

export default {
  name: 'ContactUs',
  data () {
    return {
      active: null,
      checkbox: true,
      radioGroup: 1,
      switch1: true,
      polite: '',
      polites: [
        { text: 'Mr' },
        { text: 'Ms' },
        { text: 'Mrs' }
      ],
      subject: '',
      subjects: [
        { text: 'One' },
        { text: 'Two' }
      ],
      message: '',
      maxMessageSize: maxCharCount(this.message, 500)
    }
  },

  methods: {
    next () {
      const active = parseInt(this.active)
      this.active = (active < 2 ? active + 1 : 0).toString()
    }
  }
}
</script>
