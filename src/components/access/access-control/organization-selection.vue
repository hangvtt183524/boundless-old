<template lang="pug">
  .organization-selection
    v-layout.organization-selection__row.network-selection-row(row wrap)
      v-flex.organization-selection__column(xs12 lg6)
        .organization-selection__options
          .organization-selection__options__header
            search-input.organization-selection__options__header__search-input(
              v-model="search"
              :placeholder="$t('general.search')"
            )

          .organization-selection__options__list
            base-table(
              :items="organizationOptions"
              :headers="headers"
              :sortable="false"
              :multi-selectable="true"
              :selectedRows="selectedOrganizationOptions"
              :selectable-row-filter="selectableRowFilter"
              :empty-state-message="$t('v2.access.noOrganizationsAvailable')"
              select-on-row-click
              @rowSelect="onRowSelect"
              @rowDeselect="onRowDeselect"
            )

            .organization-selection__options__list__loading-indicator(
              v-if="loading"
            )
              v-progress-circular(
                :size="50"
                indeterminate
                color="#15ac2f"
              )

      v-flex.organization-selection__column(xs12 lg6)
        .organization-selection__selections
          .organization-selection__selections__header
            .organization-selection__selections__header__title
              | {{ $t('v2.access.selectedOrganizations') }}

          .organization-selection__selections__list
            base-table(
              :items="selectedOrganizationOptions"
              :headers="headers"
              :sortable="true"
              :actions="selectionTableActions"
              @actionClick="onSelectionTableActionClick"
              :actions-label="$t('general.remove')"
              :empty-state-message="$t('v2.access.noOrganizationsSelected')"
              key="selections"
            )

</template>

<script>
import { mapGetters } from 'vuex'
import BaseTable from '@/components/v2/base-table/base-table'
import SearchInput from '@/components/v2/search-input/search-input.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'organization-selection',
  components: {
    BaseTable,
    SearchInput
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      search: null,
      fullAccessValue: 'full',
      headers: [
        {
          text: this.$t('general.organization'),
          value: 'name',
          tooltip: true,
          tooltipFormatter: (value, row) => {
            // Display information on organizations with insufficient access
            return row.max_access === this.fullAccessValue
              ? null
              : this.$t('v2.access.organizationInsufficientAccessTooltip')
          }
        }
      ],
      selectionTableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove',
          tooltip: this.$t('v2.access.removeFromList')
        }
      ],
      products: ['access_control'],
      selectableRowFilter: (row) => {
        // We must have full access to the organization for it to be importable into access control
        return row.max_access === this.fullAccessValue
      }
    }
  },
  computed: {
    ...mapGetters('workspace', ['manageableOrganizations']),
    organizationOptions () {
      return this.manageableOrganizations.map(organization => {
        return {
          name: organization.name,
          id: organization.meraki_id,
          max_access: organization.max_access
        }
      }).sort((first, second) => {
        if (first.name.toLowerCase() > second.name.toLowerCase()) {
          return 1
        } else if (second.name.toLowerCase() > first.name.toLowerCase()) {
          return -1
        }

        return 0
      })
    },
    selectedOrganizationOptions () {
      return this.organizationOptions.filter(organization => {
        return this.value.indexOf(organization.id) > -1
      })
    }
  },
  methods: {
    onRowSelect (selectedRows) {
      this.$emit('input', [
        ...this.value,
        ...selectedRows.map(option => option.id)
      ])
    },
    onRowDeselect (deselectedRows) {
      this.$emit('input', this.value.filter(organizationId => {
        return deselectedRows.map(row => row.id).indexOf(organizationId) === -1
      }))
    },
    onSelectionTableActionClick (action, item) {
      if (action === 'remove') {
        this.$emit('input', this.value.filter(organizationId => organizationId !== item.id))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.organization-selection {

  &__row:not(:last-child) {
    padding-bottom: 30px;
    margin-bottom: 30px;
    border-bottom: 3px solid $gray-xlight;
  }

  &__options {
    border: 1px solid $gray-light;

    &__header {
      height: 40px;
      overflow: hidden;

      .base-text-input ::v-deep {
        input {
          height: 40px;
          color: $text-dark;
          border: none;
          padding: 9px 54px 9px 35px;
          border-radius: 0;

          &:focus {
            border-color: $green-light;
          }
        }

        .v-icon {
          opacity: 1;
          right: auto;
          left: 8px !important;
          color: $text-medium;
        }

        .search-input__clear-icon {
          display: none;
        }
      }

      .base-select ::v-deep {
        .select-container {
          border-radius: 0;
          border-top-width: 0;
          border-left-width: 0;
          border-bottom-width: 0;
          border-color: $gray-light;
        }

        .options {
          border-color: $gray-light;
        }
      }
    }

    &__option {
      height: 40px;
      line-height: 40px;
      border-bottom: 2px solid $gray-xlight;
      padding: 0 13px;

      .base-check-box {
        line-height: normal;
        margin-top: 10px;
      }
    }

    &__list {
      position: relative;

      .base-table {
        height: auto;

        ::v-deep {
          .header-cell--selection-cell {
            width: 80px !important;
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
        background-color: rgba($white, 0.6);
      }
    }
  }

  &__selections {
    border: 1px solid $gray-light;

    &__header {
      height: 40px;
      padding: 0 10px;
      overflow: hidden;

      &__title {
        float: left;
        line-height: 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-medium;
      }

      &__action {
        float: right;
        line-height: 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        text-decoration-line: underline;
        color: $blue-reserve;
        cursor: pointer;
      }
    }

    &__selection {
      height: 40px;
      line-height: 40px;
      border-bottom: 2px solid $gray-xlight;
      padding: 0 13px 0 40px;
    }
  }

  &--has-query-fields {
    .organization-selection__options {
      &__header {
        &__query-field-selection {
          width: 150px;
          display: inline-block;
        }

        &__search-input {
          width: calc(100% - 150px);
          display: inline-block;
        }
      }
    }
  }
}

@media only screen and (min-width: 1264px) {
  .organization-selection {
    height: 100%;

    &__row.network-selection-row {
      height: 100%;

      .organization-selection__column {
        height: 100%;
      }
    }

    &__options {
      height: 100%;

      &__list {
        height: calc(100% - 40px);
        overflow: hidden;

        .base-table {
          height: 100%;
        }
      }
    }

    &__selections {
      height: 100%;
      margin-left: 30px;

      &__list {
        height: calc(100% - 40px);
        overflow: hidden;

        .base-table {
          height: 100%;
        }
      }
    }
  }
}

@media only screen and (max-width: 1263px) {
  .organization-selection {
    &__selections {
      margin-top: 30px;
    }
  }
}

</style>
