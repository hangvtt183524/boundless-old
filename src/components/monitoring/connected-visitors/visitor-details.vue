<template lang="pug">
  .page-content
    v-layout.mb-3(row wrap)
      v-flex(xs12)
        h2 {{ $t('general.connectedVisitorDetails') }}

    v-divider
    v-layout(row wrap my-4 v-loading="loading")
      v-flex.pa-2.pt-3(xs12 md6)
        general-info

      v-flex.pa-2.pt-3(xs12 md6)
        connection-info

    social-info
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

import ConnectionInfo from './connection-info'
import GeneralInfo from './general-info'
import SocialInfo from './social-info'

export default {
  props: {
    visitorId: {
      type: [Number, String],
      required: true
    },
    nodeId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    ConnectionInfo,
    GeneralInfo,
    SocialInfo
  },
  mounted () {
    this.fetchVisitorDetails({
      nodeId: this.nodeId,
      visitorId: this.visitorId
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      this.loading = false
    })
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('organization/visitor', ['visitorDetails'])
  },
  methods: {
    ...mapActions('organization/visitor', ['fetchVisitorDetails'])
  }
}
</script>
