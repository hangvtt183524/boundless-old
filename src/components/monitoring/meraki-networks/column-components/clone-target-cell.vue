<template lang="pug">
  .clone-target-cell
    base-select.base-select--small(
      :value="item.target_organization"
      @input="onItemInput(item, 'target_organization', $event)"
      :items="organizationOptions"
    )

    base-switch(
      :value="item.create_new_network"
      @input="onItemInput(item, 'create_new_network', $event)"
      :yes-label="$t('v2.merakiNetworks.clone')"
      :no-label="$t('v2.merakiNetworks.copyToExisting')"
    )

    base-text-input.base-text-input--small(
      v-if="item.create_new_network"
      :value="item.new_network_name"
      @input="onItemInput(item, 'new_network_name', $event)"
    )

    base-select.base-select--small(
      v-if="!item.create_new_network"
      :value="item.target_network"
      @input="onItemInput(item, 'target_network', $event)"
      :items="targetNetworkOptions"
    )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSwitch from '@/components/v2/base-switch/base-switch'

export default {
  name: 'clone-target-cell',
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  components: {
    BaseTextInput,
    BaseSelect,
    BaseSwitch
  },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    }
  },
  data: function () {
    return {
      targetNetworkOptions: []
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    workspaceMerakiOrganizations () {
      return this.userWorkspaceOrganizations.filter(workspaceOrganization => !!workspaceOrganization.meraki_organization)
    },
    organizationOptions () {
      return this.workspaceMerakiOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.meraki_organization.id,
          name: workspaceOrganization.meraki_organization.name,
          organization_id: workspaceOrganization.id
        }
      })
    },
    selectedOrganizationId () {
      return this.organizationOptions.find(item => item.key === this.item.target_organization).organization_id
    }
  },
  methods: {
    ...mapActions('organization/meraki', ['fetchNetworks']),
    fetchNetworkList () {
      this.loading = true
      this.fetchNetworks({
        organizationId: this.selectedOrganizationId,
        page_size: 0
      }).then(response => {
        this.targetNetworkOptions = response.data.data.map(network => {
          return {
            key: network.id,
            name: network.name
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    onItemInput (item, field, value) {
      this.$emit('customFieldInput', item, field, value)

      if (field === 'create_new_network' && value) {
        // If switching to create new network, reset any target network selections
        this.$emit('customFieldInput', item, 'target_network', null)
      }

      if (field === 'target_organization') {
        // On target organization change, fetch target network options
        this.fetchNetworkList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .clone-target-cell {
    white-space: nowrap;

    .base-select {
      display: inline-block;
      width: 200px;
      margin-right: 10px;
    }

    .base-switch-container {
      display: inline-block;
      margin-right: 10px;
    }

    .base-text-input {
      display: inline-block;
      width: 200px;
      margin-right: 10px;
    }
  }
</style>
