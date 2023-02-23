<template lang="pug">
  .role-access-selection
    v-layout.role-access-selection__row(row wrap)
      v-flex.role-access-selection__column(xs12 lg6)
        .role-access-selection__column__title
          | {{ $t('v2.access.checkTheBoxesToAllowUsersAccess') }}

        .role-access-selection__entities
          .role-access-selection__entities__header
            search-input.role-access-selection__entities__header__search-input(
              v-model="search"
              :placeholder="$t('general.search')"
            )

          perfect-scrollbar.role-access-selection__entities__list
            role-access-selection-entity.role-access-selection__entities__entity(
              v-for="entity of permissionEntities"
              :key="entity.key"
              :entity="entity"
              :value="getEntityValue(entity, value)"
              @input="onEntityInput(entity.key, $event)"
              :search="search"
              :is-fixed="isFixed"
            )

            .role-access-selection__entities__list__loading-indicator(
              v-if="loading"
            )
              v-progress-circular(
                :size="50"
                indeterminate
                color="#15ac2f"
              )

      v-flex.role-access-selection__column(xs12 lg6)
        .role-access-selection__column__title
          | {{ $t('v2.access.usersWillAccessTheseEntities') }}

        .role-access-selection__selections
          .role-access-selection__selections__header
            .role-access-selection__selections__header__title
              | {{ $t('general.selections') }}

          perfect-scrollbar.role-access-selection__selections__list
            role-access-selection-entity.role-access-selection__entities__entity(
              v-for="entity of value.children"
              :key="entity.key"
              :entity="entity"
              :is-fixed="true"
            )
            .list-empty-state(
              v-if="!loading && !(value.children && value.children.length > 0)"
            )
              .list-empty-state__message
                | {{ $t('v2.access.menusWillAppearHere') }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '@/components/v2/search-input/search-input'
import RoleAccessSelectionEntity from './role-access-selection-entity'

export default {
  name: 'role-access-selection',
  components: {
    RoleAccessSelectionEntity,
    SearchInput
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    vendor: {
      type: String,
      required: true
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    isExistingRole: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      loading: false,
      search: null,
      fullAccessValue: 'full'
    }
  },
  mounted () {
    this.fetchEntities()
  },
  computed: {
    ...mapGetters('workspace/access', ['permissionEntities'])
  },
  methods: {
    ...mapActions('workspace/access', ['fetchPermissionEntities']),
    fetchEntities () {
      const filters = {
        vendor: this.vendor
      }

      this.loading = true
      this.fetchPermissionEntities(filters).finally(() => {
        this.loading = false
      })
    },
    getEntitySelectionValueWithDescendants (entity) {
      return {
        ...entity,
        access: this.fullAccessValue,
        children: (entity.children || []).map(child => this.getEntitySelectionValueWithDescendants(child))
      }
    },
    getEntityValue (entity, parentValue) {
      return (parentValue.children || []).find(item => item.key === entity.key)
    },
    onEntityInput (entityKey, value) {
      const existingChildren = (this.value && this.value.children ? this.value.children : [])
      let updatedChildren

      if (value) {
        // Child selected
        updatedChildren = existingChildren.find(child => child.key === value.key)
          ? existingChildren.map(childValue => {
            // Return existing value for other items, new value for updated item
            return childValue.key === value.key ? value : childValue
          })
          : existingChildren.concat([value])
      } else {
        // Child de-selected
        updatedChildren = existingChildren.filter(child => child.key !== entityKey)
      }

      // If child already part of entity selection value, replace it with new value
      this.$emit('input', {
        ...this.value,
        children: updatedChildren
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .role-access-selection {

    &__column {
      &__title {
        line-height: 40px;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: $text-dark;
      }
    }

    &__entities {
      border: 1px solid $gray-light;

      &__header {
        height: 40px;
        overflow: hidden;
        border-bottom: 1px solid $gray-medium;

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
      }

      &__list {
        position: relative;

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
        border-bottom: 1px solid $gray-medium;

        &__title {
          float: left;
          line-height: 40px;
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          color: $text-medium;
        }
      }

      &__list {
        position: relative;
      }
    }
  }

  @media only screen and (min-width: 1264px) {
    .role-access-selection {
      height: 100%;

      &__row, &__column {
        height: 100%;
      }

      &__column:last-child {
        .role-access-selection__column__title {
          margin-left: 30px;
        }
      }

      &__entities {
        height: calc(100% - 40px);

        &__list {
          height: calc(100% - 40px);
          overflow: hidden;
        }
      }

      &__selections {
        height: calc(100% - 40px);
        margin-left: 30px;

        &__list {
          height: calc(100% - 40px);
          overflow: hidden;
        }
      }
    }
  }

  @media only screen and (max-width: 1263px) {
    .role-access-selection {
      &__selections {
        margin-top: 30px;
      }
    }
  }

</style>
