<template lang="pug">
  .dashboard-detail-page.page-content
    v-layout(row wrap)
      v-flex(xs12 lg4 xl3)
        .dashboard-detail-page__section.dashboard-detail-page__entity-selection
          .dashboard-detail-page__section__header
            .dashboard-detail-page__entity-selection__header__title
              | {{ $t('v2.dashboard.chooseEntity') }}

            .dashboard-detail-page__section__header__actions
              base-button.base-button--blue.dashboard-detail-page__section__header__actions__action(
                @click="onAddWidgetClick"
                :disabled="!selectedEntity"
              ) {{ $t('v2.dashboard.addWidget') }}

          .dashboard-detail-page__section__content
            perfect-scrollbar.dashboard-detail-page__section__content__scroll-area
              .dashboard-detail-page__entity-selection__search-input-container
                base-text-input.dashboard-detail-page__entity-selection__search-input-container__search-input(
                  v-model="entitiesSearch"
                  :placeholder="$t('general.search')"
                )
                  v-icon.dashboard-detail-page__entity-selection__search-input-container__search-input__icon search

              dashboard-entity-item(
                v-for="entity of visibleDashboardEntities"
                :key="entity.key"
                :entity="entity"
                :selected-entity="selectedEntity"
                @entitySelect="onEntitySelect"
              )

      v-flex(xs12 lg8 xl9)
        .dashboard-detail-page__section.dashboard-detail-page__widgets
          .dashboard-detail-page__section__header
            .dashboard-detail-page__widgets__header__title
              | {{ $t('v2.dashboard.dashboard') }}
            .dashboard-detail-page__section__header__actions
              base-button.base-button--green.dashboard-detail-page__section__header__actions__action(
                @click="onSaveClick"
                :disabled="!(isValid && isValueChanged)"
              ) {{ $t('general.saveChanges') }}
              base-button.base-button--green--negative.dashboard-detail-page__section__header__actions__action(
                @click="onResetClick"
                :disabled="!isValueChanged"
              ) {{ $t('builder.reset') }}

          .dashboard-detail-page__section__content.dashboard-detail-page__widgets__content
            perfect-scrollbar.dashboard-detail-page__section__content__scroll-area

              .dashboard-detail-page__widgets__content__dashboard-form
                v-layout(row wrap).dashboard-detail-page__widgets__content__row
                  v-flex(xs6 md4 lg3 xl2)
                    label {{ $t('v2.dashboard.dashboardName') }}
                  v-flex(xs6 md8 lg8 xl6)
                    base-text-input(
                      v-model="dashboard.name"
                    )

                v-layout(row wrap).dashboard-detail-page__widgets__content__row
                  v-flex(xs6 md4 lg3 xl2)
                    label {{ $t('v2.merakiTemplates.roles') }}
                  v-flex(xs6 md8 lg8 xl6)
                    base-multi-select(
                      v-model="dashboard.roles"
                      :items="roleOptions"
                    )

              .dashboard-detail-page__widgets__content__widget(
                v-for="widget of (dashboard.widgets || [])"
                :key="widget.id"
              )
                dashboard-widget(
                  v-if="getEntityById(widget.entity)"
                  :widget="widget"
                  :entity="getEntityById(widget.entity)"
                  :dashboard-id="dashboardId"
                  operation-mode="configuration"
                  @updateClick="onUpdateWidgetClick(widget)"
                  @removeClick="onRemoveWidgetClick(widget)"
                )

    .dashboard-detail-page__loading-indicator(
      v-if="loading"
    )
      v-progress-circular(
        :size="50"
        indeterminate
        color="#15ac2f"
      )

    dashboard-widget-configuration-modal(
      v-if="activeEntity"
      :show="isDashboardConfigurationModalVisible"
      :entity="activeEntity"
      :widget-data="activeWidget"
      @close="closeDashboardConfigurationModalModal"
    )

</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import DashboardEntityItem from './dashboard-entity-item'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import DashboardWidget from './widget/dashboard-widget'
import DashboardWidgetConfigurationModal from './dashboard-widget-configuration-modal'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'dashboard-detail',
  components: {
    DashboardWidgetConfigurationModal,
    DashboardWidget,
    DashboardEntityItem,
    BaseButton,
    BaseTextInput,
    BaseMultiSelect
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    dashboardId: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      entitiesSearch: null,
      dashboard: {
        name: null,
        roles: [],
        widgets: []
      },
      originalDashboard: {
        name: null,
        roles: [],
        widgets: []
      },
      selectedEntity: null,
      isDashboardConfigurationModalVisible: false,
      activeWidget: null,
      activeEntity: null,
      roleNodeTypes: {
        organization: 'organization',
        workspace: 'workspace'
      },
      roleOptions: []
    }
  },
  mounted () {
    // Select first section by default,
    if (this.dashboardId) {
      this.fetchDashboardInstance()
    }

    if (!(this.dashboardEntities && this.dashboardEntities.length > 0)) {
      this.fetchRootEntities()
    }

    // Fetch role options
    this.fetchOwnerRoles()
  },
  computed: {
    ...mapGetters('workspace/network', ['dashboardEntities']),
    isExistingDashboard () {
      return this.dashboard && this.dashboard.id
    },
    isValid () {
      return !!this.dashboard.name && this.dashboard.widgets.length > 0
    },
    isValueChanged () {
      return !_.isEqual(this.dashboard, this.originalDashboard)
    },
    visibleDashboardEntities () {
      return (this.entitiesSearch && this.entitiesSearch.length > 1) ? this.getFlatDashboardEntities().filter(entity => {
        const entityName = this.$t(`v2.dashboard.entities.${entity.key}`)
        return entityName.toLowerCase().indexOf(this.entitiesSearch.toLowerCase()) > -1
      }) : this.dashboardEntities
    }
  },
  watch: {
    entitiesSearch: {
      handler: function () {
        // Clear entity selection on search change
        this.selectedEntity = null
      }
    }
  },
  methods: {
    ...mapActions('workspace/network', ['createDashboard', 'updateDashboard', 'fetchDashboard', 'fetchDashboardEntities']),
    ...mapActions('administration', ['fetchRoles']),
    fetchDashboardInstance () {
      this.loading = true
      this.fetchDashboard({
        workspaceId: this.workspaceId,
        id: this.dashboardId
      }).then(response => {
        this.$set(this, 'dashboard', response.data.data)
        this.$set(this, 'originalDashboard', JSON.parse(JSON.stringify(response.data.data)))
      }).finally(() => {
        this.loading = false
      })
    },
    fetchRootEntities () {
      this.loading = true
      this.fetchDashboardEntities({
        page_size: 0,
        ancestor: 0
      }).finally(() => {
        this.loading = false
      })
    },
    fetchOwnerRoles () {
      const filters = {
        page_size: 0,
        workspace: this.workspaceId,
        node_types: 'workspace'
      }

      this.fetchRoles(filters).then(response => {
        this.$set(this, 'roleOptions', response.data.data.map(role => {
          return {
            key: role.id,
            name: role.title
          }
        }))
      })
    },
    getFlatDashboardEntities (parent = null) {
      const flatEntities = []
      const items = parent === null ? this.dashboardEntities : parent.children

      for (let i = 0; i < items.length; i++) {
        flatEntities.push({
          ...items[i],
          children: []
        })

        let childEntities = this.getFlatDashboardEntities(items[i])
        childEntities.forEach(childEntity => {
          // We may have duplicate items in tree structure, do not add those multiple times into flat list
          if (!flatEntities.find(entity => entity.key === childEntity.key)) {
            flatEntities.push(childEntity)
          }
        })
      }

      return flatEntities
    },
    getEntityById (entityId, parent = null) {
      const items = parent === null ? this.dashboardEntities : parent.children

      for (let i = 0; i < items.length; i++) {
        if (items[i].id === entityId) {
          return items[i]
        } else {
          const entity = this.getEntityById(entityId, items[i])
          if (entity) {
            return entity
          }
        }
      }

      return null
    },
    onEntitySelect (entity) {
      if (entity === this.selectedEntity) {
        // Cancel selection
        this.$set(this, 'selectedEntity', null)
      } else {
        this.$set(this, 'selectedEntity', entity)
      }
    },
    onAddWidgetClick () {
      this.openDashboardConfigurationModalModal(null, this.selectedEntity)

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_DASHBOARD_WIDGET_ADDED)
    },
    onUpdateWidgetClick (widget) {
      this.openDashboardConfigurationModalModal(widget, this.getEntityById(widget.entity))
    },
    onRemoveWidgetClick (widget) {
      this.dashboard.widgets.splice(this.dashboard.widgets.indexOf(widget), 1)
    },
    openDashboardConfigurationModalModal (widget, entity) {
      this.activeWidget = widget
      this.activeEntity = entity

      setTimeout(function () {
        this.isDashboardConfigurationModalVisible = true
      }.bind(this), 50)
    },
    closeDashboardConfigurationModalModal (widget) {
      this.isDashboardConfigurationModalVisible = false

      if (widget) {
        if (this.activeWidget) {
          // Updated existing widget
          this.dashboard.widgets.splice(this.dashboard.widgets.indexOf(this.activeWidget), 1, widget)
          global.toastr['success'](this.$t('v2.dashboard.updateWidgetSuccess'), this.$t('general.success'))
        } else {
          // Added new widget
          this.dashboard.widgets.push(widget)
          global.toastr['success'](this.$t('v2.dashboard.addWidgetSuccess'), this.$t('general.success'))
        }
      }
    },
    onSaveClick () {
      let saveMethod
      if (this.isExistingDashboard) {
        // Updating an existing dashboard
        saveMethod = this.updateDashboard
      } else {
        // Creating a new dashboard
        saveMethod = this.createDashboard
      }

      this.loading = true
      saveMethod({
        workspaceId: this.workspaceId,
        ...this.dashboard
      }).then(response => {
        this.$set(this, 'dashboard', response.data.data)
        this.$set(this, 'originalDashboard', JSON.parse(JSON.stringify(response.data.data)))

        global.toastr['success'](this.$t('v2.dashboard.dashboardSaveSuccess'), this.$t('general.success'))
      }).catch(() => {
        global.toastr['error'](this.$t('v2.dashboard.dashboardSaveFailure'), this.$t('general.error'))
      }).finally(() => {
        this.loading = false
      })

      EventTracker.sendEvent(EVENT_NAMES.CUSTOM_DASHBOARD_SAVED)
    },
    onResetClick () {
      this.$set(this, 'dashboard', JSON.parse(JSON.stringify(this.originalDashboard)))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-detail-page {
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

    &__entity-selection {
      &__header {
        &__title {
          float: left;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 18px;
          line-height: 60px;
          letter-spacing: 1px;
          color: $text-medium;
        }
      }

      &__search-input-container {
        &__search-input {
          &__icon {
            color: $text-dark !important;
            right: 12px !important;
          }
        }

        .base-text-input ::v-deep {
          input {
            background: rgba(white, 0.2);
            height: 51px;
            color: $text-dark;
            border: none;
            padding: 9px 54px 9px 45px;
            border-radius: 0;

          }

          .v-icon {
            opacity: 1;
            right: 34px !important;
          }
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
      }

      &__content {
        padding-left: 30px;

        &__row {
          padding: 0 10px;
          margin-bottom: 20px;

          label {
            line-height: 40px;
          }
        }

        &__dashboard-form {
          margin-top: 60px;
          padding-bottom: 40px;
          border-bottom: 3px solid $gray-xlight;

          margin-right: 30px;
        }

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
    .dashboard-detail-page {
      &__section {
        height: calc(100vh - 120px);

        &.dashboard-detail-page__entity-selection {
          margin-right: 20px;
        }
      }
    }
  }

  @media only screen and (max-width: 1264px) {
    .dashboard-detail-page {
      &__section {
        height: auto;
        min-height: 420px;

        &.dashboard-detail-page__entity-selection {
          height: 420px;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
