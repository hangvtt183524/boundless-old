<template lang="pug">
  div.ldap-server-details
    v-layout.header-section(row wrap)
      h3.small-heading.py-3
        | {{ $t('organization.ldapServerConfiguration') }}
    .form-card.round
      v-layout(row wrap)
        v-flex(xs12)
          v-text-field.server-input(
            data-test="server-input"
            :label="$t('wifi.serverAddress')"
            ref="server"
            v-model="serverModel"
            :error-messages="serverErrors"
            @input="delayTouch($v.server)"
            @blur="$v.server.$touch"
          )
        v-flex(xs12)
          v-text-field.base-dn-input(
            data-test="base-dn-input"
            :label="$t('wifi.baseDn')"
            ref="baseDn"
            v-model="baseDnModel"
            :error-messages="baseDnErrors"
            @input="delayTouch($v.baseDn)"
            @blur="$v.baseDn.$touch"
          )
</template>
<script>
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    server: {
      type: String
    },
    baseDn: {
      type: String
    }
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      serverModel: '',
      baseDnModel: ''
    }
  },

  validations: {
    server: {
      required
    },
    baseDn: {
      required
    }
  },
  computed: {
    serverErrors () {
      const errors = []
      this.$v.server.$dirty && !this.serverModel && errors.push(`${this.$t('errors.required')}`)
      return errors
    },
    baseDnErrors () {
      const errors = []
      this.$v.baseDn.$dirty && !this.baseDnModel && errors.push(`${this.$t('errors.required')}`)
      return errors
    }
  },
  watch: {
    serverModel (v) {
      this.makeParams()
    },
    baseDnModel (v) {
      this.makeParams()
    },
    server (v) {
      this.getData()
    },
    baseDn (v) {
      this.getData()
    }
  },
  methods: {
    makeParams () {
      const data = {
        server: this.serverModel,
        base_dn: this.baseDnModel
      }
      this.$emit('change', data)
    },
    getData () {
      this.serverModel = this.server
      this.baseDnModel = this.baseDn
    }
  }
}
</script>
<style lang="scss">
  .ldap-server-details {
    min-width: 400px;
  }
</style>
