<template lang="pug">
  template-setting-item.template-types(
    :title="$t('v2.merakiTemplates.networkTypes')"
    :operation-mode="operationMode"
    :is-empty="isEmpty"
  )
    template(v-slot:sub_header)
      .template-setting-item__header__left-warning.template-setting-item__header__left-warning--info(
      ) {{ $t('v2.merakiTemplates.networkTypesWarning') }}

    template(v-slot:default)

      v-layout(
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('v2.merakiTemplates.networkTypes') }}
        v-flex(xs6 md8 lg9 xl10)
          base-multi-select(
            :items="typeOptions"
            :value="settingValue || []"
            @input="onInput"
            :disabled="isFixed"
            :placeholder="$t('v2.placeholders.separateByCommas')"
          )

</template>

<script>
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseMultiSelect from '@/components/v2/base-multi-select/base-multi-select'

export default {
  name: 'types',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: {
    BaseMultiSelect,
    TemplateSettingItem
  },
  data: function () {
    return {
      field_key: 'types',
      typeOptions: ['appliance', 'wireless', 'switch', 'cellularGateway',
        'environmental', 'camera', 'sensor', 'systemsManager'].map(item => {
        return {
          key: item,
          name: this.$t(`v2.merakiTemplates.types.${item}`)
        }
      })
    }
  },
  methods: {
    onInput (value) {
      this.$emit('settingInput', this.field_key, value)
    }
  }
}
</script>
