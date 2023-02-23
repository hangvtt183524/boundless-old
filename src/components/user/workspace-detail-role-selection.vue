<template lang="pug">
  .workspace-detail-role-selection
    base-table.workspace-detail-role-selection__roles-table(
      :items="value"
      :headers="tableHeaders"
      :actions="tableActions"
      :sortable="false"
      :no-background="noTableBackground"
      :always-editable="true"
      @actionClick="onActionClick"
      @itemInput="onItemInput"
      ref="table"
    )
    span.workspace-detail-role-selection__add-role-trigger(
      @click="onAddRoleClick"
    ) + {{ $t('v2.user.addAccessPrivileges') }}
</template>

<script>
import NewRoleLink from './new-role-link'
import BaseTable from '@/components/v2/base-table/base-table.vue'
import { mapActions } from 'vuex'

export default {
  name: 'workspace-detail-role-selection',
  components: {
    BaseTable
  },
  props: {
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    workspaceRoles: {
      type: Array,
      required: false
    },
    workspace: {
      type: Number,
      required: true
    },
    roleNodeTypes: {
      type: Array,
      default: function () {
        return []
      }
    },
    noTableBackground: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'workspace'
    }
  },
  data: function () {
    return {
      roles: [],
      nodes: [],
      tableActions: [
        {
          icon: '$vuetify.icons.delete',
          type: 'remove'
        }
      ]
    }
  },
  mounted () {
    // If roles provided from parent, use them. Fetch workspace roles otherwise
    if (this.workspaceRoles) {
      this.$set(this, 'roles', this.workspaceRoles)
    } else {
      this.fetchWorkspaceRoles()
    }

    // If value is empty, add initial role
    if (this.value.length === 0) {
      this.onAddRoleClick()
    }
  },
  computed: {
    roleOptions () {
      return this.roles.map(role => {
        return {
          key: role.id,
          name: role.title
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
    tableHeaders () {
      return [
        {
          text: this.$t('general.role'),
          value: 'role.id',
          editable: true,
          options: this.roleOptions,
          optionsSearchEnabled: true,
          optionsSearchPlaceholder: this.$t('v2.user.selectRole'),
          width: '240px',
          validations: {
            required: true
          },
          headMore: {
            component: NewRoleLink,
            props: {
              mode: this.mode
            }
          }
        }
      ]
    }
  },
  watch: {
    workspace: {
      handler: function () {
        if (!this.workspaceRoles) {
          this.fetchWorkspaceRoles()
        }
      }
    },
    workspaceRoles: {
      handler: function () {
        if (this.workspaceRoles) {
          this.$set(this, 'roles', this.workspaceRoles)
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('administration', ['fetchRoles']),
    fetchWorkspaceRoles () {
      const filters = {
        page_size: 0,
        workspace: this.workspace
      }

      if (this.roleNodeTypes && this.roleNodeTypes.length > 0) {
        filters.node_types = this.roleNodeTypes
      }

      this.fetchRoles(filters).then(response => {
        this.$set(this, 'roles', response.data.data)
      })
    },
    onActionClick (actionType, item) {
      if (actionType === 'remove') {
        this.$emit('input', this.value.filter(listItem => {
          return listItem !== item
        }))
      }
    },
    onAddRoleClick () {
      const userRole = this.getEmptyUserRole()
      this.$emit('input', this.value.concat([userRole]))

      // Make row editable by default
      this.$refs.table.onEditClick(userRole)
    },
    getEmptyUserRole () {
      return {
        role: {
          id: null
        },
        node: {
          id: this.workspace
        }
      }
    },
    onItemInput (item, field, value) {
      this.$set(item, field, value)
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/base.scss";
  @import "styles/v2/colors.scss";

  .workspace-detail-role-selection {

    &__roles-table ::v-deep{
      max-width: 550px;

      .v-datatable {
        width: 96%;
      }

      .header-cell--actions-cell {
        opacity: 0;
        padding: 0 5px 0 0 !important;
        max-width: 27px;
        width: 27px;
      }
      .base-table-cell--action-cell {
        padding: 0 5px 0 0 !important;
        max-width: 27px;
        width: 27px;
      }
    }

    &__add-role-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
    }
  }
</style>
