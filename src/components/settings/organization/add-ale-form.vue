<template lang="pug">
  div(data-test="ale-config")
    v-layout(row pt-2)
      v-flex(xs12)
        v-text-field.ale-id(
          data-test="ale-id"
          :error-messages="errorMessage"
          :label="$t('general.newAleId')"
          :rules="[(v) => v.length <= 17 || $t('general.maxCharacters', {count: 17})]"
          :counter="17"
          @input="() => {$v.aleId.$reset(); clearErrorData}"
          @blur="$v.aleId.$touch()"
          required
          v-model="aleId"
        )

      v-flex(x1 pl-2 pt-1)
        v-btn(
          data-test="btn-add"
          :disabled="$v.$invalid || errorMessage.length > 0 || !isUnique"
          @click="addAleId"
          color="success"
          round
          outline
      ) {{ $t('general.add') }}

    v-layout(row wrap pr-3)
      .ale-ids(data-test="ale-ids")
        v-flex(
          v-for="(aleId, idx) in currentAleIds"
          :class="flexClass(idx)"
          :key="idx"
          xs12
          md6
        )
          removable-item(
            :action-class="{'pt-2': true}"
            :removable="!isSaving"
            @remove="removeAleId(idx)"
            align-center
          )
            v-flex(xs12)
              v-text-field(
                readonly
                :value="aleId.aruba_ale_id"
              )
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'
import { macAddress } from '@/validators'

import RemovableItem from '@/components/common/removable-item'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'

export default {
  data () {
    return {
      aleId: '',
      isSaving: false,
      actionClass: {
        'pt-2': true
      }
    }
  },
  validations: {
    aleId: {
      required,
      maxLength: maxLength(17),
      macAddress
    }
  },
  mixins: [
    ErrorHandlerMixin
  ],
  components: {
    RemovableItem
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    currentAleIds () {
      return this.selectedOrganization.aruba_ale_ids
    },
    isUnique () {
      const index = this.currentAleIds.findIndex(item => item.aruba_ale_id.toLowerCase() === this.aleId.toLowerCase())
      if (index > -1) {
        return false
      }
      return true
    },
    errorMessage () {
      let errors = []
      const aleId = this.$v.aleId
      if (!aleId.$dirty) return errors
      !aleId.required && errors.push(this.$t('errors.required'))
      !aleId.macAddress && errors.push(this.$t('general.invalidMacAddress'))
      !this.isUnique && errors.push(this.$t('general.macAddressAlreadyExists'))
      return errors.length ? errors : this.errorData.aruba_ale_ids
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization']),
    flexClass (idx) {
      if (this.$vuetify.breakpoint.mdAndUp) {
        const even = (idx + 1) % 2 === 0
        return {
          'pr-4': !even,
          'pl-4': even
        }
      }
      return {}
    },
    clearData () {
      this.isSaving = false
      this.aleId = ''
    },
    addAleId () {
      this.clearErrorData()
      this.isSaving = true
      const newIds = this.currentAleIds.slice()
      newIds.push({
        aruba_ale_id: this.aleId
      })
      this.save(newIds)
    },
    removeAleId (idx) {
      const newIds = this.currentAleIds.slice()
      newIds.splice(idx, 1)
      this.save(newIds)
    },
    save (newIds) {
      this.updateOrganization({
        id: this.selectedOrganization.id,
        aruba_ale_ids: newIds
      }).then(response => {
        this.clearData()
        this.$v.aleId.$reset()
      }).catch(err => {
        this.setErrorData(err)
      })
    }
  }
}
</script>
