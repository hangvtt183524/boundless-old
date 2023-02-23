<template lang="pug">
  .option-type
    label.option-label.mb-3.font-weight-bold.subheading {{$t('builder.internalLink')}}
    multiselect.mt-1.mb-5(
      :options="filteredPages",
      v-model="selectedInternalPage",
      :show-labels="false",
      label="text",
      @input="changePage(link)"
    )
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: Object
    },
    link: {
      type: Object
    },
    selectedPage: {
      type: Object
    }
  },
  data () {
    return {
      selectedInternalPage: {
        text: 'Guest Social',
        value: 'social'
      },
      internalPages: [
        {
          text: 'Guest Form',
          value: 'guest'
        },
        {
          text: 'Guest Social',
          value: 'social'
        },
        {
          text: 'Sponsor Page',
          value: 'sponsor'
        },
        {
          text: 'Sponsor Code',
          value: 'sponsor-code'
        },
        {
          text: 'Sponsor Wait',
          value: 'sponsor-wait'
        },
        {
          text: 'Sponsor Auth',
          value: 'sponsor-auth'
        },
        {
          text: 'SMS Access Code',
          value: 'sms-access-code'
        },
        {
          text: 'Wifi Unvailable',
          value: 'wifi-unavailable'
        },
        {
          text: 'Access Granted',
          value: 'login'
        }
      ]
    }
  },
  computed: {
    // Add Internal Page link rules here
    filteredPages () {
      return this.internalPages.filter((page) => {
        return page.value !== this.selectedPage.routeName
      })
    }
  },
  mounted () {
    if (this.link.internalPage) {
      this.selectedInternalPage = this.filteredPages.find((l) => {
        return l.value === this.link.internalPage
      })
    }
  },
  methods: {
    changePage (link) {
      link.internalPage = this.selectedInternalPage.value
    }
  }
}
</script>
