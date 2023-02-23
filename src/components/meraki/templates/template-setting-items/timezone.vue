<template lang="pug">
  template-setting-item.timezone(
    :title="$t('general.timezone')"
    :operation-mode="operationMode"
    :is-empty="isEmpty"
  )
    template(v-slot:default)

      v-layout(
        row wrap
      ).template-setting-item__content__row
        v-flex(xs6 md4 lg3 xl2)
          label {{ $t('general.timezone') }}
        v-flex(xs6 md8 lg9 xl10)
          base-select(
            :items="timezoneOptions"
            :value="settingValue || null"
            @input="onInput"
            :disabled="isFixed"
            :placeholder="$t('general.timezone')"
            clearable
          )

</template>

<script>
import timezoneList from '@/utils/timezone-list'
import TemplateSettingItem from './template-setting-item'
import NetworkTemplateSettingItemMixin from '@/mixins/network-template-setting-item.mixin'
import BaseSelect from '@/components/v2/base-select/base-select'

export default {
  name: 'timezone',
  mixins: [
    NetworkTemplateSettingItemMixin
  ],
  components: {
    BaseSelect,
    TemplateSettingItem
  },
  data: function () {
    return {
      field_key: 'timezone'
    }
  },
  computed: {
    timezoneOptions () {
      const options = timezoneList.map(item => {
        return {
          key: item.value,
          name: item.display_name
        }
      })

      if (this.settingValue && options.map(item => item.key).indexOf(this.settingValue) === -1) {
        // If currently selected timezone not in options list, add it.
        options.push({
          key: this.settingValue,
          name: this.settingValue
        })
      }

      return options
    }
  },
  methods: {
    onInput (value) {
      this.$emit('settingInput', this.field_key, value)
    }
  }
}
</script>
