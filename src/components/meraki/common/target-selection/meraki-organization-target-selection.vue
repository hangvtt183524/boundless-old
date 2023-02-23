<template lang="pug">
  base-multi-select(
    :value="flatValue"
    :items="targetOptions"
    :search-enabled="true"
    :placeholder="placeholder ? placeholder : $t('v2.securityCompliance.targetInputPlaceholder')"
    @input="onTargetInput"
    @searchInput="onTargetSearchInput"
    @focus="onFocus"
  )

</template>

<script>
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import { mapActions } from 'vuex'

export default {
  name: 'meraki-organization-target-selection',
  components: { BaseMultiSelect },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array,
      required: true
    },
    organization: {
      type: Object,
      required: true
    },
    targetTypes: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    },
    fullAccessLabel: {
      type: String,
      required: false
    }
  },
  data: function () {
    return {
      searchTargetOptions: [],
      isActivated: false
    }
  },
  computed: {
    flatValue () {
      // Flat list of targets as type_id elements, to be used in multi text input component
      return this.value.map(target => {
        return `${target.target_type}__${target.id}`
      })
    },
    targetOptions () {
      // Fixed "All networks" option + current items + suggestions by entered text
      const targetOptions = []

      if (this.organization && this.organization.meraki_organization) {
        targetOptions.push({
          key: `organization__${this.organization.meraki_organization.id}`,
          name: this.fullAccessLabel ? this.fullAccessLabel : this.$t('v2.securityCompliance.allNetworks')
        })
      }

      this.value.filter(target => {
        return target.target_type !== 'organization'
      }).forEach(target => {
        targetOptions.push({
          key: `${target.target_type}__${target.id}`,
          name: `${this.$t('v2.securityCompliance.targetTypes.' + target.target_type)}: ${target.name}`,
          targetName: target.name
        })
      })

      this.searchTargetOptions.forEach(target => {
        const targetKey = `${target.target_type}__${target.id}`
        if (!targetOptions.find(targetOption => {
          return targetOption.key === targetKey
        })) {
          targetOptions.push({
            key: targetKey,
            name: `${this.$t('v2.securityCompliance.targetTypes.' + target.target_type)}: ${target.name}`,
            targetName: target.name
          })
        }
      })

      return targetOptions
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiTargetSuggestions']),
    onTargetInput (flatTargets) {
      this.$emit('input', flatTargets.map(flatTarget => {
        const [ targetType, targetId ] = flatTarget.split('__')

        // Get target name from current options list
        const targetName = this.targetOptions.find(targetOption => {
          return targetOption.key === flatTarget
        }).targetName

        return {
          target_type: targetType,
          id: parseInt(targetId),
          name: targetName,
          meraki_organization: this.organization.meraki_organization.id
        }
      }))
    },
    onTargetSearchInput (searchText) {
      this.fetchMerakiTargetSuggestions({
        workspaceId: this.workspaceId,
        organizations: [this.organization.id],
        query: searchText,
        target_types: this.targetTypes
      }).then(response => {
        this.$set(this, 'searchTargetOptions', response.data.data)
      })
    },
    onFocus () {
      if (!this.isActivated) {
        // Focusing for the first time, fetch initial target suggestions
        this.onTargetSearchInput('')
      }

      this.isActivated = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
