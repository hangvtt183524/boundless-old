<template lang="pug">
  .dashboard-widget-parameters(
    :class="{'dashboard-widget-parameters--inner': isInner}"
  )
    .dashboard-widget-parameters__parameter(
      v-for="parameter of effectiveParameters"
      :key="parameter.name"
    )
      v-layout(row wrap)
        v-flex(xs6 md4 lg3 xl2)
          label(
            :title="getParameterDisplayName(parameter)"
          ) {{ getParameterDisplayName(parameter) }}

        v-flex(
          xs6 md8 lg9
          :class="[{'xl7': !isInner}, {'xl10': isInner}]"
        )
          base-select(
            v-if="[parameterTypes.string, parameterTypes.integer, parameterTypes.float].indexOf(parameter.type) > -1 && !!parameter.options"
            v-model="effectiveValue[parameter.name]"
            :items="getParameterOptions(parameter)"
            :validations="{required: parameter.is_required}"
            :disabled="disabled"
          )
          base-text-input(
            v-else-if="parameter.type === parameterTypes.string"
            v-model="effectiveValue[parameter.name]"
            :validations="{required: parameter.is_required}"
            :disabled="disabled"
          )
          base-text-input(
            v-else-if="[parameterTypes.integer, parameterTypes.float, parameterTypes.number].indexOf(parameter.type) > -1"
            v-model="effectiveValue[parameter.name]"
            type="number"
            :validations="{required: parameter.is_required}"
            :disabled="disabled"
          )
          base-switch(
            v-else-if="parameter.type === parameterTypes.boolean"
            v-model="effectiveValue[parameter.name]"
            :disabled="disabled"
          )
          base-multi-select(
            v-else-if="parameter.type === parameterTypes.array && parameter.child_type !== parameterTypes.object && !!parameter.options"
            v-model="effectiveValue[parameter.name]"
            :items="getParameterOptions(parameter)"
            :validations="{required: parameter.is_required}"
            :disabled="disabled"
          )
          multi-text-input(
            v-else-if="parameter.type === parameterTypes.array && parameter.child_type !== parameterTypes.object && !parameter.options"
            v-model="effectiveValue[parameter.name]"
            :placeholder="$t('v2.placeholders.separateByCommas')"
            :validations="{required: parameter.is_required}"
            :disabled="disabled"
          )
          dashboard-widget-table-parameter(
            v-else-if="parameter.type === parameterTypes.array && parameter.child_type === parameterTypes.object"
            v-model="effectiveValue[parameter.name]"
            :parent-value="effectiveValue"
            :parameter="parameter"
            :fields="fields"
            :disabled="disabled"
          )
          dashboard-widget-parameters(
            v-else-if="parameter.type === parameterTypes.object"
            v-model="effectiveValue[parameter.name]"
            :parameters="parameter.children"
            :fields="fields"
            :disabled="disabled"
            :is-inner="true"
          )

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import BaseSwitch from '@/components/v2/base-switch/base-switch'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'
import MultiTextInput from '@/components/v2/multi-text-input/multi-text-input'
import DashboardWidgetTableParameter from './dashboard-widget-table-parameter'
import DashboardWidgetParameterMixin from '@/mixins/dashboard-widget-parameter.mixin'

export default {
  name: 'dashboard-widget-parameters',
  components: {
    DashboardWidgetTableParameter,
    MultiTextInput,
    BaseMultiSelect,
    BaseSelect,
    BaseTextInput,
    BaseSwitch
  },
  mixins: [
    DashboardWidgetParameterMixin
  ],
  props: {
    value: {
      type: Object,
      required: true
    },
    parameters: {
      type: Array,
      required: true
    },
    fields: {
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isInner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    effectiveParameters () {
      // In case of parameters put under a single dictionary key, returns individual parameters
      let effectiveParameters = this.parameters
      while (effectiveParameters.length === 1 && effectiveParameters[0].type === this.parameterTypes.object) {
        effectiveParameters = effectiveParameters[0].children
      }

      // Apply field filters if provided for operation
      if (this.fields && this.fields.length > 0) {
        effectiveParameters = effectiveParameters.filter(parameter => this.fields.indexOf(parameter.id) > -1)
      }

      return effectiveParameters
    },
    effectiveValue () {
      // In case of parameters put under a single dictionary key, returns a model containing individual parameters
      let effectiveValue = this.value
      let modelKeys = Object.keys(effectiveValue)

      while (modelKeys.length === 1 && effectiveValue[modelKeys[0]] !== null && effectiveValue[modelKeys[0]].constructor === Object) {
        effectiveValue = effectiveValue[modelKeys[0]]
        modelKeys = Object.keys(effectiveValue)
      }

      return effectiveValue
    }
  },
  methods: {
    getParameterOptions (parameter) {
      return (parameter.options || []).map(option => {
        return {
          key: option,
          name: option
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .dashboard-widget-parameters {
    &__parameter {
      margin-top: 10px;

      label {
        line-height: 40px;
        padding-right: 10px;
        display: block;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .base-switch-container {
        margin-top: 5px;
      }
    }

    &--inner {
      .dashboard-widget-parameters__parameter:first-child {
        margin-top: 0;
      }
    }
  }
</style>
