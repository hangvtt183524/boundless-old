<template lang="pug">
  .dashboard-widget-table-parameter
    base-table(
      :items="value"
      :headers="getParameterTableHeaders(parameter)"
      :actions="arrayParameterTableActions"
      :sortable="false"
      :always-editable="true"
      @itemInput="onTableItemInput"
      @actionClick="onTableActionClick"
      :is-fixed="disabled"
    )
    span.dashboard-widget-table-parameter__add-item-trigger(
      :class="{'dashboard-widget-table-parameter__add-item-trigger--disabled': disabled}"
      @click="onAddTableItemClick()"
    ) + {{ $t('general.addNew') }}

</template>

<script>
import BaseTable from '@/components/v2/base-table/base-table'
import DashboardWidgetParameterMixin from '@/mixins/dashboard-widget-parameter.mixin'

export default {
  name: 'dashboard-widget-table-parameter',
  components: {
    BaseTable
  },
  mixins: [
    DashboardWidgetParameterMixin
  ],
  props: {
    value: {
      type: Object,
      required: true
    },
    parentValue: {
      type: Object,
      required: true
    },
    parameter: {
      type: Object,
      required: true
    },
    fields: {
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      arrayParameterTableActions: [{
        icon: '$vuetify.icons.delete',
        type: 'remove'
      }]
    }
  },
  methods: {
    getParameterTypeValue (parameter) {
      switch (parameter.type) {
        case this.parameterTypes.string:
          return String
        case this.parameterTypes.integer:
          return Number
        case this.parameterTypes.float:
          return Number
        case this.parameterTypes.number:
          return Number
        case this.parameterTypes.boolean:
          return Boolean
        case this.parameterTypes.array:
          return Array
        case this.parameterTypes.object:
          return Object
        default:
          return String
      }
    },
    getParameterTableHeaders (parameter) {
      return parameter.children.map(childParameter => {
        return {
          text: this.getParameterDisplayName(childParameter),
          value: childParameter.name,
          editable: true,
          type: this.getParameterTypeValue(childParameter),
          options: childParameter.options ? childParameter.options.map(option => {
            return {
              key: option,
              name: option
            }
          }) : null,
          validations: {
            required: childParameter.is_required
          }
        }
      })
    },
    onTableItemInput (tableItem, field, value) {
      this.$set(tableItem, field, value)
    },
    onAddTableItemClick () {
      if (this.disabled) {
        return false
      }

      let tableItemModel = {}
      this.buildParameterModel(this.parameter.children, tableItemModel)

      this.$set(this.parentValue, this.parameter.name, [
        ...(this.parentValue[this.parameter.name] || []),
        tableItemModel
      ])
    },
    onTableActionClick (action, tableItem) {
      if (action === 'remove') {
        const itemIndex = this.value.indexOf(tableItem)

        this.$set(this.parentValue, this.parameter.name, this.value.filter((item, index) => {
          return index !== itemIndex
        }))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-widget-table-parameter {
    &__add-item-trigger {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 35px;
      text-decoration-line: underline;
      color: $green-medium;
      cursor: pointer;
      user-select: none;

      &--disabled {
        cursor: not-allowed;
        color: $gray-light;
      }
    }
  }
</style>
