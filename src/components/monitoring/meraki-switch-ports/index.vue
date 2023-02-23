<template lang="pug">
  .meraki-switch-ports-page.page-content
    .meraki-switch-ports-page__header
      .meraki-switch-ports-page__header__title {{$t('v2.merakiSwitchPorts.switchPortMonitoring')}}
      search-input.base-text-input--small.meraki-switch-ports-page__header__search-input(
        :placeholder="$t('v2.merakiSwitchPorts.searchNetworks')"
        v-model="search"
      )

    .meraki-switch-ports-page__content
      .meraki-switch-ports-page__content__filter
        base-select(
          v-model="workspaceMerakiOrganization"
          :items="workspaceMerakiOrganizationOptions"
          :label="$t('general.organization')"
        )

        .meraki-switch-ports-page__content__filter__organization-details(
          v-if="selectedWorkspaceOrganization"
        )
          span.meraki-switch-ports-page__content__filter__organization-details__label
            | {{ $t('v2.merakiSwitchPorts.organizationTotalConsumption') }}:
          span.meraki-switch-ports-page__content__filter__organization-details__value
            | {{ Math.round(selectedWorkspaceOrganization.power_usage * 10) / 10 }} Wh

      .meraki-switch-ports-page__content__networks
        switch-port-network-list(
          v-if="selectedMerakiOrganizationId"
          :meraki-organization-id="selectedMerakiOrganizationId"
          :search="search"
        )

</template>

<script>
import { mapActions } from 'vuex'
import SearchInput from '@/components/v2/search-input/search-input'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import EmptyOrganizationListCheckMixin from '@/mixins/empty-organization-list-check.mixin'
import SwitchPortNetworkList from './network-list'
import BaseSelect from '@/components/v2/base-select/base-select'

export default {
  name: 'meraki-switch-ports-page',
  components: {
    BaseSelect,
    SwitchPortNetworkList,
    SearchInput
  },
  mixins: [
    CurrentNodeSelectionsMixin,
    EmptyOrganizationListCheckMixin
  ],
  data: function () {
    return {
      search: '',
      loading: false,
      workspaceMerakiOrganizations: [],
      workspaceMerakiOrganization: null
    }
  },
  mounted () {
    this.fetchOrganizationOptions()
  },
  computed: {
    selectedMerakiOrganizationId () {
      return this.workspaceMerakiOrganization
    },
    workspaceMerakiOrganizationOptions () {
      return this.workspaceMerakiOrganizations.map(organization => {
        return {
          key: organization.id,
          name: organization.name
        }
      })
    },
    selectedWorkspaceOrganization () {
      return this.workspaceMerakiOrganizations.find(organization => organization.id === this.workspaceMerakiOrganization)
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchMerakiMonitoringSwitchPortsOrganizations']),
    fetchOrganizationOptions () {
      this.fetchMerakiMonitoringSwitchPortsOrganizations({
        workspaceId: this.workspaceId,
        page_size: 0
      }).then(response => {
        this.workspaceMerakiOrganizations = response.data.data

        // Select first organization be default
        this.workspaceMerakiOrganization = this.workspaceMerakiOrganizations.length > 0 ? this.workspaceMerakiOrganizations[0].id : null
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .meraki-switch-ports-page {
    background-color: $white;
    position: relative;
    height: calc(100vh - 160px);

    &__header {
      height: 60px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 0 30px;

      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 60px;
        text-transform: uppercase;
        color: #53575A;
        display: inline-block;
        margin-right: 60px;
      }

      &__search-input {
        display: inline-block;
        line-height: 60px;
        width: 262px;
      }
    }

    &__content {
      padding: 24px 30px;
      box-sizing: border-box;
      height: calc(100% - 60px);
      position: relative;

      &__filter {
        margin-bottom: 20px;

        .base-select {
          display: inline-block;
          width: 360px;

          ::v-deep {
            .select-container {
              width: calc(100% - 120px);
            }
          }
        }

        &__organization-details {
          display: inline-block;
          margin-left: 20px;

          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 41px;
          color: $text-medium;

          &__value {
            font-weight: 600;
            margin-left: 10px;
          }
        }
      }

      &__networks {
        height: calc(100% - 61px);
      }
    }

    &__loading-indicator {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
</style>
