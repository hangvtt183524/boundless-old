<template lang="pug">
  .step-one
     v-layout(row wrap)
      v-flex(xs12)
        v-layout(wrap)
          v-flex(xs12, sm6, pr-2, mb-3 class="input-wrap")
            node-select(
              :indent-level="0"
              :items="nodesWithSelectedDisabled"
              :label="this.$t('venue.venue')"
              hide-details
              search-enabled
              v-model="value.selectedGroup"
              required
              :error-message="getErrors('selectedGroup')"
              @input="$v.value.selectedGroup.$touch"
              @blur="$v.value.selectedGroup.$touch"
            )
          v-flex(xs12 sm6, pl-2 class="input-wrap")
            v-text-field(
              :label="this.$t('wifi.quantityOfVoucher')"
              v-model="value.quantityOfVoucher"
              :min="1"
              :max="10000"
              :disabled="value.id ? true : false"
              type="number"
              :error-messages="getErrors('quantityOfVoucher')"
              @keypress="onQuantityKeyPress($event)"
              @paste="onQuantityPaste($event)"
              @input="$v.value.quantityOfVoucher.$touch"
              @blur="$v.value.quantityOfVoucher.$touch"
            )
      v-flex(xs12)
        v-text-field(
          v-model='value.batchName'
          :label="this.$t('wifi.batchName')"
          required
          :error-messages="getErrors('batchName')"
          @input="$v.value.batchName.$touch"
          @blur="$v.value.batchName.$touch"
        )
      v-flex(xs12)
        v-text-field(
          v-model="value.batchDescription"
          auto-grow
          textarea
          :label="this.$t('wifi.batchDescription')"
          rows="2"
          counter
          maxlength="200"
          required
          :error-messages="getErrors('batchDescription')"
          @input="$v.value.batchDescription.$touch"
          @blur="$v.value.batchDescription.$touch"
        )
</template>

<script>
import { mapGetters } from 'vuex'
import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

import { maxLength, required } from 'vuelidate/lib/validators'
import { isNumber } from '@/utils/functions'
import NodeSelect from '@/components/common/node-select'

const voucherQuantityValid = (value) => {
  const numericValue = Number(value)
  return numericValue && Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 10000
}

export default {
  props: ['value'],
  mixins: [
    ManageableNodesMixin,
    ErrorHandlerMixin
  ],

  components: {
    NodeSelect
  },

  data () {
    return {
    }
  },
  validations: {
    value: {
      batchName: {
        required,
        maxLength: maxLength(64)
      },
      quantityOfVoucher: {
        required,
        voucherQuantityValid
      },
      batchDescription: {
        required,
        maxLength: maxLength(64)
      },
      selectedGroup: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    nodesWithSelectedDisabled () {
      const nodeTypes = ['organization', 'group', 'site']
      const nodes = this.getNodesByType(nodeTypes)

      return nodes
    }
  },
  methods: {
    onQuantityKeyPress (event) {
      const charCode = event.which ? event.which : event.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
        event.preventDefault()
      }

      return true
    },
    onQuantityPaste (event) {
      const value = event.clipboardData.getData('text')
      if (!isNumber(value)) {
        event.preventDefault()
      }

      return true
    },
    getErrors (fieldName) {
      const vueErrors = this.getVueErrors(`value.${fieldName}`)
      if (vueErrors.length > 0) {
        return vueErrors
      } else {
        return this.getErrorMessages(fieldName)
      }
    },
    isValid () {
      return !this.$v.value.$invalid
    }
  }
}
</script>
