<template lang="pug">
  editable-panel(
    :disableSubmit="$v.value.$invalid"
    v-if="selectedNode.type === 'site'"
    :is-editing="isEditing && !hideActions"
    :is-loading="isLoading"
    @cancel="cancelEdit"
    @edit="edit"
    @submit="submit"
    round
  )
    v-form(slot-scope="{readonly}")
      v-layout(row wrap)
        v-flex(xs12 md6 px-3)
          node-name-input(
            :error-messages="validateErrors('name')"
            :label="$t('settings.facilityName')"
            :readonly="readonly"
            placeholder="--"
            required
            v-model="value.name"
            @input="$v.value.name.$touch()"
            @blur="$v.value.name.$touch()"
          )

        v-flex(xs12 md6 px-3)
          node-select(
            :indent-level="0"
            :node-types="['organization', 'group']"
            :label="$t('general.group')"
            :readonly="readonly"
            :placeholder="'--'"
            v-model="value.parent"
          )

        v-flex(xs12 px-3)
          address-input(
            :error-messages="validateErrors('formattedAddress')"
            :readonly="readonly"
            placeholder="--"
            @changed="addressChanged"
            :label="$t('general.address')"
            v-model="value.formattedAddress"
            required
            @input="onChangeAddress"
            @blur="$v.value.formattedAddress.$touch()"
          )

        v-flex(xs12 md6 px-3)
          v-select(
            :error-messages="validateErrors('timezone')"
            :items="timezoneChoices"
            :label="$t('settings.selectTimeZone')"
            item-text="display_name"
            required
            placeholder="--"
            v-model='value.timezone'
            @input="$v.value.timezone.$touch()"
            @blur="$v.value.timezone.$touch()"
          )

        v-flex(xs12 md6 px-3)
          v-select(
            :items="industryList"
            :label="$t('general.industry')"
            :readonly="readonly"
            clearable
            item-text="display_name"
            placeholder="--"
            v-model="value.sector"
          )
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'
import { NODE_LIST_CHANGE_EVENT } from '@/constants/events'

import EditablePanelMixin from '@/mixins/editable-panel.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import SiteDetailMixin from '@/mixins/site-detail.mixin'

import AddressInput from '@/components/common/address-input'
import EditablePanel from '@/components/common/editable-panel'
import NodeSelect from '@/components/common/node-select'
function isCorrectName () {
  if (this.value.name.trim()) {
    return true
  }
  return false
}
export default {
  mixins: [
    ErrorHandlerMixin,
    EditablePanelMixin,
    SiteDetailMixin
  ],
  components: {
    AddressInput,
    EditablePanel,
    NodeSelect
  },
  props: {
    hideActions: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (this.selectedNode.id) {
      this.fetchData()
    }
  },
  validations: {
    value: {
      name: {
        required,
        maxLength: maxLength(64),
        isCorrectName
      },
      formattedAddress: {
        required
      },
      timezone: {
        required
      }
    }
  },
  data () {
    return {
      value: {
        id: null,
        name: '',
        timezone: '',
        parent: null,
        sector: '',
        formattedAddress: '',
        google_places: {},
        address: {},
        tags: []
      },
      nodeData: {},
      industryList: [
        { display_name: this.$t('general.industryList.energy'), value: 'energy' },
        { display_name: this.$t('general.industryList.materials'), value: 'materials' },
        { display_name: this.$t('general.industryList.industrials'), value: 'industrials' },
        { display_name: this.$t('general.industryList.transportation'), value: 'transportation' },
        { display_name: this.$t('general.industryList.automotive'), value: 'automotive' },
        { display_name: this.$t('general.industryList.retail'), value: 'retail' },
        { display_name: this.$t('general.industryList.hospitality'), value: 'hospitality' },
        { display_name: this.$t('general.industryList.services'), value: 'services' },
        { display_name: this.$t('general.industryList.healthcare'), value: 'healthcare' },
        { display_name: this.$t('general.industryList.financials'), value: 'financials' },
        { display_name: this.$t('general.industryList.informationTechnology'), value: 'information_technology' },
        { display_name: this.$t('general.industryList.realEstate'), value: 'real_estate' },
        { display_name: this.$t('general.industryList.publicSector'), value: 'public_sector' }
      ]
    }
  },
  computed: {
    ...mapGetters(['countryNames']),
    ...mapGetters('layout', ['selectedNode'])
  },
  watch: {
    selectedNode (v) {
      this.fetchData()
    }
  },
  methods: {
    ...mapActions('organization/site', ['fetchSiteData', `fetchGroupData`, 'fetchGroupOrgData', 'updateSite']),
    cancelEdit () {
      this.cancel()
      this.setSiteData()
    },
    addressChanged (place) {
      this.setJsonAddressAndTimezone(place)
      this.setSiteData()
    },
    setSiteData () {
      this.$emit('setSiteData', this.value)
    },
    fetchData () {
      if (this.selectedNode.type === 'site') {
        this.fetchSiteData(this.selectedNode.id).then(response => {
          this.nodeData = response && response.data && response.data.data ? response.data.data : {}
          this.setFormData()
          this.setSiteData()
        })
      } else if (this.selectedNode.type === 'group') {
        Promise.all([
          this.fetchGroupData(this.selectedNode.id),
          this.fetchGroupOrgData(this.selectedNode.id)
        ]).then(([groupData, detailResponse]) => {
          const groupDetails = detailResponse.data.data
          groupDetails.tags = groupData && groupData.data && groupData.data.data && groupData.data.data.tags ? groupData.data.data.tags : []
          this.$emit('setOrgOrGroupData', groupDetails)
        })
      } else {
        this.fetchGroupOrgData(this.selectedNode.id).then(response => {
          this.$emit('setOrgOrGroupData', response.data.data)
        })
      }
    },
    setFormData () {
      Object.keys(this.value).forEach(key => {
        this.$set(this.value, key, this.nodeData[key])
      })
      if (this.nodeData.google_places && this.nodeData.google_places.formatted_address) {
        this.$set(this.value, 'formattedAddress', this.nodeData.google_places.formatted_address)
      }
    },
    submit () {
      this.isLoading = true
      this.updateSite(this.value).then(response => {
        if (this.value.parent !== this.nodeData.parent) {
          this.$eventHub.$emit(NODE_LIST_CHANGE_EVENT)
        }
        this.showSuccessMessage()
        this.isEditing = false
      }).catch(err => {
        this.setErrorData(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    validateErrors (fieldName) {
      const errors = []
      const name = this.$v.value[fieldName]
      if (!name.$dirty) return errors
      !name.required && errors.push(this.$t('errors.required'))
      fieldName === 'name' && !name.isCorrectName && errors.push(this.$t('errors.name'))
      return errors
    }
  }
}
</script>
