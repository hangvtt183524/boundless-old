<template lang="pug">
  .user-dashboard-page.page-content
    v-layout(row wrap)
      v-flex(xs12)
        .user-dashboard-page__section.user-dashboard-page__widgets
          .user-dashboard-page__section__header
            .user-dashboard-page__widgets__header__title
              | {{ dashboard.name }}
            .user-dashboard-page__widgets__header__selections
              base-select(
                :items="organizationOptions"
                v-model="selectedOrganizationId"
                :placeholder="$t('general.workspace')"
                :show-validation-state="true"
                :validations="{required: true}"
              )
            .user-dashboard-page__section__header__actions

          .user-dashboard-page__section__content.user-dashboard-page__widgets__content
            perfect-scrollbar.user-dashboard-page__section__content__scroll-area
              .user-dashboard-page__widgets__content__widget(
                v-for="widget of (dashboard.widgets || [])"
                :key="widget.id"
              )
                dashboard-widget(
                  :widget="widget"
                  :entity="widget.entity"
                  :dashboard-id="dashboardId"
                  :selected-organization-id="selectedOrganizationId"
                )

    .user-dashboard-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DashboardWidget from './widget/dashboard-widget'
import BaseSelect from '@/components/v2/base-select/base-select'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'dashboard-detail',
  components: {
    DashboardWidget,
    BaseSelect
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    dashboardId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      dashboard: {
        name: null,
        widgets: []
      },
      selectedOrganizationId: null
    }
  },
  mounted () {
    // Select first section by default,
    this.fetchUserDashboardInstance()

    // Select first organization by default
    if (this.organizationOptions.length > 0) {
      this.selectedOrganizationId = this.organizationOptions[0].key
    }

    EventTracker.sendEvent(EVENT_NAMES.CUSTOM_DASHBOARD_USED)
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    workspaceMerakiOrganizations () {
      return this.userWorkspaceOrganizations.filter(workspaceOrganization => !!workspaceOrganization.meraki_organization)
    },
    organizationOptions () {
      return this.workspaceMerakiOrganizations.map(workspaceOrganization => {
        return {
          key: workspaceOrganization.id,
          name: workspaceOrganization.name
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      // Re-initialize on route change, necessary when user is switching between dashboards
      this.fetchUserDashboardInstance()
    },
    organizationOptions (newValue, oldValue) {
      if (newValue && newValue.length > 0 && (!oldValue || oldValue.length === 0)) {
        // If organizations just loaded, select first organization by default
        this.selectedOrganizationId = this.organizationOptions[0].key
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['fetchUserDashboard']),
    fetchUserDashboardInstance () {
      this.loading = true
      this.fetchUserDashboard({
        workspaceId: this.workspaceId,
        id: this.dashboardId
      }).then(response => {
        this.$set(this, 'dashboard', response.data.data)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .user-dashboard-page {
    position: relative;

    &__section {
      background-color: $white;

      &__header {
        height: 60px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        padding: 0 30px;
        overflow: hidden;

        &__actions {
          float: right;

          .base-button {
            margin-top: 10px;
            margin-left: 10px;
            padding: 0 20px;
          }
        }
      }

      &__content {
        height: calc(100% - 60px);

        &__scroll-area {
          height: calc(100%);
        }
      }
    }

    &__widgets {
      &__header {
        overflow: hidden;
        padding-left: 0;

        &__title {
          float: left;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 60px;
        }

        &__selections {
          float: left;

          .base-select {
            margin-top: 10px;
            margin-left: 10px;
            padding: 0 20px;
            min-width: 240px;
          }
        }
      }

      &__content {
        padding-left: 30px;

        &__widget {
          padding-top: 20px;
          margin-bottom: 10px;
          padding-bottom: 40px;

          margin-right: 30px;
        }

        &__widget:not(:last-child) {
          border-bottom: 3px solid $gray-xlight;
        }
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

  @media only screen and (min-width: 1264px) {
    .user-dashboard-page {
      &__section {
        height: calc(100vh - 120px);
      }
    }
  }

  @media only screen and (max-width: 1264px) {
    .user-dashboard-page {
      &__section {
        height: auto;
      }
    }
  }
</style>
