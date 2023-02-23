<template>
  <div class="l7-application-cell-content">
    <span v-if="!editable">{{ displayValue }}</span>
    <div v-if="editable">
      <base-select
        class="base-select--small category-select"
        v-model="category"
        @input="onCategoryInput"
        :items="categoryOptions"
        :validations="requiredValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-select>

      <base-text-input
        v-if="category === 'http_hostname'"
        v-model="httpHostname"
        @input="onInput"
        class="hostname-input base-text-input--small"
        :placeholder="$t('wifi.hostname')"
        :validations="hostNameValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-text-input>

      <base-text-input
        v-if="category === 'remote_ip_range' || category === 'remote_ip_range_and_port'"
        v-model="remoteIpRange"
        @input="onInput"
        class="ip-range-input base-text-input--small"
        :placeholder="$t('wifi.ipRange')"
        :validations="cidrValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-text-input>

      <base-text-input
        v-if="category === 'port' || category === 'remote_ip_range_and_port'"
        v-model="port"
        @input="onInput"
        class="port-input base-text-input--small"
        :placeholder="$t('wifi.port')"
        :validations="portValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-text-input>

      <base-multi-select
        v-if="category === 'allowed_countries'"
        v-model="allowedCountries"
        @input="onInput"
        class="base-multi-select--small"
        :items="countryOptions"
        :validations="requiredValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-multi-select>

      <base-multi-select
        v-if="category === 'blocked_countries'"
        v-model="blockedCountries"
        @input="onInput"
        class="base-multi-select--small"
        :items="countryOptions"
        :validations="requiredValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-multi-select>

      <base-select
        v-if="category && category !== 'http_hostname' && category !== 'remote_ip_range' &&
          category !== 'port' && category !== 'remote_ip_range_and_port' &&
          category !== 'allowed_countries' && category !== 'blocked_countries'"
        v-model="application"
        @input="onInput"
        class="base-select--small"
        :items="applicationOptions"
        :validations="requiredValidation"
        :show-validation-state="showValidationState"
        :suppress-validation-state-display="suppressValidationStateDisplay"></base-select>
    </div>
  </div>
</template>

<script>
import BaseSelect from '../../../v2/base-select/base-select'
import BaseTextInput from '../../../v2/base-text-input/base-text-input'
import BaseMultiSelect from '../../../v2/base-multi-select/base-multi-select'
import { mapGetters } from 'vuex'
import { isValidCidr, isValidHostname } from '@/utils/meraki-validations'
import { isValidPort, isValidPortRange } from '@/utils/form-fields-validation-rules'
import { countryCodes } from '@/constants/countries'

export default {
  name: 'firewall-rule-set-l7-application-cell',
  components: { BaseTextInput, BaseSelect, BaseMultiSelect },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    },
    editable: {
      type: Boolean,
      default: false
    },
    showValidationState: {
      type: Boolean,
      default: false
    },
    suppressValidationStateDisplay: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      category: null,
      application: null,
      httpHostname: null,
      remoteIpRange: null,
      port: null,
      allowedCountries: [],
      blockedCountries: [],
      countryOptions: countryCodes.map(code => {
        return {
          key: code,
          name: this.$te(`general.countries.${code}`) ? this.$t(`general.countries.${code}`) : code
        }
      }),
      requiredValidation: { required: true },
      portValidation: { required: true, methods: [{ method: (value) => { return isValidPort(value) || isValidPortRange(value) || (value && value.toLowerCase() === 'any') } }] },
      cidrValidation: { required: true, methods: [{ method: isValidCidr }] },
      hostNameValidation: { required: true, methods: [{ method: isValidHostname }] }
    }
  },
  created () {
    if (this.options.length > 0) {
      this.setInitialSelection()
    }
  },
  computed: {
    ...mapGetters('workspace/network', ['l7ApplicationCategories']),
    options: function () {
      return this.l7ApplicationCategories.map(category => {
        return {
          key: category.id,
          name: category.name,
          applications: category.applications.map(application => {
            return {
              key: application.id,
              name: application.name
            }
          })
        }
      })
    },
    applicationOptions: function () {
      if (this.category) {
        // Return a list containing top level category option and applications
        let options = [{
          'key': this.category,
          'name': this.$t('media.all')
        }]

        const categoryObject = this.options.filter(category => {
          return category.key === this.category
        })[0]

        if (categoryObject) {
          options = options.concat(categoryObject.applications)
        }

        return options
      }

      return []
    },
    categoryOptions: function () {
      return this.options.map(option => {
        return {
          key: option.key,
          name: option.name
        }
      }).concat([
        {
          key: 'http_hostname',
          name: this.$t('wifi.httpHostname')
        },
        {
          key: 'port',
          name: this.$t('wifi.port')
        },
        {
          key: 'remote_ip_range',
          name: this.$t('wifi.remoteIpRange')
        },
        {
          key: 'remote_ip_range_and_port',
          name: this.$t('wifi.remoteIpRangeAndPort')
        },
        {
          key: 'allowed_countries',
          name: this.$t('v2.merakiTemplates.allowedCountries')
        },
        {
          key: 'blocked_countries',
          name: this.$t('v2.merakiTemplates.blockedCountries')
        }
      ])
    },
    selectionValue: function () {
      if (!this.category) {
        return null
      }

      if (this.category === 'http_hostname') {
        return this.httpHostname
      } else if (this.category === 'port') {
        return this.port
      } else if (this.category === 'remote_ip_range') {
        return this.remoteIpRange
      } else if (this.category === 'remote_ip_range_and_port') {
        return this.remoteIpRange + ':' + this.port
      } else if (this.category === 'allowed_countries') {
        return this.allowedCountries
      } else if (this.category === 'blocked_countries') {
        return this.blockedCountries
      } else {
        // Application
        if (!this.application) {
          return null
        }

        return {
          id: this.application
        }
      }
    },
    selectedRuleType: function () {
      if (!this.category) {
        return null
      }

      if (this.category === 'http_hostname') {
        return 'host'
      } else if (this.category === 'port') {
        return 'port'
      } else if (this.category === 'remote_ip_range') {
        return 'ipRange'
      } else if (this.category === 'remote_ip_range_and_port') {
        return 'ipRange'
      } else if (this.category === 'allowed_countries') {
        return 'allowedCountries'
      } else if (this.category === 'blocked_countries') {
        return 'blockedCountries'
      } else {
        // Application
        if (!this.application) {
          return null
        }

        if (this.application.indexOf('application') > -1) {
          return 'application'
        } else {
          return 'applicationCategory'
        }
      }
    },
    displayValue: function () {
      if (!this.value) {
        return null
      }

      if (['host', 'port', 'ipRange'].indexOf(this.item.type) > -1) {
        return this.value
      }

      if (this.item.type === 'allowedCountries') {
        return this.countryOptions
          .filter(option => this.allowedCountries.indexOf(option.key) > -1)
          .map(option => option.name)
          .join(', ')
      }

      if (this.item.type === 'blockedCountries') {
        return this.countryOptions
          .filter(option => this.blockedCountries.indexOf(option.key) > -1)
          .map(option => option.name)
          .join(', ')
      }

      if (this.item.type === 'applicationCategory') {
        const categoryObject = this.options.filter(category => {
          return category.key === this.value.id
        })[0]

        if (categoryObject) {
          return categoryObject.name
        } else {
          return null
        }
      }

      if (this.item.type === 'application') {
        for (let i = 0; i < this.options.length; i++) {
          const applicationObject = this.options[i].applications.filter(application => {
            return application.key === this.value.id
          })[0]

          if (applicationObject) {
            return applicationObject.name
          }
        }
      }

      return null
    }
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        if (oldValue.length === 0 && newValue.length > 0) {
          this.setInitialSelection()
        }
      },
      deep: true
    }
  },
  methods: {
    setInitialSelection: function () {
      // Depending on item type, parse value and set initial selections accordingly
      if (this.item.type === 'application') {
        // Find applications category first
        this.$set(this, 'category', this.findCategoryByApplication(this.value.id))
        this.$set(this, 'application', this.value.id)
      } else if (this.item.type === 'applicationCategory') {
        this.$set(this, 'category', this.value.id)
        this.$set(this, 'application', this.value.id)
      } else if (this.item.type === 'host') {
        this.$set(this, 'category', 'http_hostname')
        this.$set(this, 'httpHostname', this.value)
      } else if (this.item.type === 'allowedCountries') {
        this.$set(this, 'category', 'allowed_countries')
        this.$set(this, 'allowedCountries', this.value)
      } else if (this.item.type === 'blockedCountries') {
        this.$set(this, 'category', 'blocked_countries')
        this.$set(this, 'blockedCountries', this.value)
      } else if (this.item.type === 'ipRange') {
        if (this.value.indexOf(':') > -1) {
          this.$set(this, 'category', 'remote_ip_range_and_port')
          const ipRangeElements = this.value.split(':')
          this.$set(this, 'remoteIpRange', ipRangeElements[0])
          this.$set(this, 'port', ipRangeElements[1])
        } else {
          this.$set(this, 'category', 'remote_ip_range')
          this.$set(this, 'remoteIpRange', this.value)
        }
      } else if (this.item.type === 'port') {
        this.$set(this, 'category', 'port')
        this.$set(this, 'port', this.value)
      }
    },
    findCategoryByApplication: function (applicationId) {
      let categoryKey = null

      for (let i = 0; i < this.options.length; i++) {
        const category = this.options[i]
        if (category.applications.filter(application => {
          return application.key === applicationId
        }).length) {
          // Category found
          categoryKey = category.key
          break
        }
      }

      return categoryKey
    },
    onCategoryInput: function () {
      // Reset previous selections on category change
      this.$set(this, 'application', null)
      this.$set(this, 'httpHostname', null)
      this.$set(this, 'remoteIpRange', null)
      this.$set(this, 'port', null)
      this.$set(this, 'allowedCountries', [])
      this.$set(this, 'blockedCountries', [])

      this.$emit('input', this.selectionValue)

      // Emit input event for type field as well
      this.$emit('customFieldInput', this.item, 'type', this.selectedRuleType)
    },
    onInput: function () {
      this.$emit('input', this.selectionValue)

      // Emit input event for type field as well
      this.$emit('customFieldInput', this.item, 'type', this.selectedRuleType)
    }
  }
}
</script>

<style lang="scss" scoped>
.l7-application-cell-content {
  .base-select--small, .hostname-input {
    width: calc(50% - 10px);
    display: inline-block;
    margin-right: 10px;
  }

  .base-multi-select--small {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 210px);
  }

  .category-select {
    max-width: 200px;
  }

  .ip-range-input {
    width: calc(30% - 10px);
    display: inline-block;
    margin-right: 10px;
  }

  .port-input {
    width: calc(20% - 10px);
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
