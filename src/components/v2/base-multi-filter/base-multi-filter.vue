<template lang="pug">
  .base-multi-filter(
    v-click-outside="onClickOutside"
  )
    .base-multi-filter__add-filter(
      @click="addFilterExpanded = true"
    ) {{ $t('v2.merakiClients.addFilter') }}
    transition(name='slide')
      .base-multi-filter__dropdown(v-show="addFilterExpanded")
        .base-multi-filter__dropdown__header(
          @click="onClickDropdownHeader"
        ) {{ $t('general.filterBy') }}
          v-icon.base-multi-filter__dropdown__header__icon arrow_drop_down
        .base-multi-filter__dropdown__body
          .base-multi-filter__dropdown__body__item(
            v-for="item in items"
            :key="item.name"
            :class="[{'base-multi-filter__dropdown__body__item--selected': item.selected }]"
            @click="onChangeFilterItem(item)"
          ) {{ item.name }}
    .base-multi-filter__option(
      v-for="item of items"
      :key ="item.name"
      v-if="item.selected"
    )
      .base-multi-filter__option__title {{ item.name }}:
      .base-multi-filter__option__value
        base-autocomplete(
          v-if="item.autocompleteKey || item.fixedOptions"
          :ref="item.name"
          @optionSelect="onFilterOptionSelect(item, ...arguments)"
          @focus="onClickOutside"
          :autocomplete-key="item.autocompleteKey"
          :fixed-options="item.fixedOptions ? item.fixedOptions : null"
          :show-organization-name="item.showOrganizationName"
          :unique-by-name="item.uniqueByName"
        )
        base-text-input(
          v-if="!(item.autocompleteKey || item.fixedOptions)"
          v-model="item.value"
          :ref="item.name"
          @input="onStaticFilterInput()"
        )

      .base-multi-filter__option__close-icon(
        @click="onRemoveFilterItem(item)"
      )
        v-icon close
</template>

<script>
import _ from 'lodash'
import BaseAutocomplete from '@/components/v2/base-autocomplete/base-autocomplete'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  name: 'base-multi-filter',
  props: {
    items: {
      type: Array,
      default: null
    }
  },
  components: {
    BaseTextInput,
    BaseAutocomplete
  },
  data: function () {
    return {
      addFilterExpanded: false,
      lastFilter: {}
    }
  },
  methods: {
    onChangeFilterItem (item) {
      item.selected = !item.selected
      if (item.selected) {
        this.addFilterExpanded = false
        setTimeout(() => {
          const $ref = this.$refs[item.name][0]
          if ($ref) {
            const $input = $ref.$el.querySelector('input')
            if ($input) {
              $input.focus()
            }
          }
        }, 100)
      }
    },
    calcNewFilter () {
      const newFilter = {}
      this.items.forEach(item => {
        if (item.selected) {
          newFilter[item.key] = item.value
        }
      })
      return _.cloneDeep(newFilter)
    },
    onRemoveFilterItem (item) {
      item.selected = false
      const newFilter = this.calcNewFilter()
      if (!_.isEqual(newFilter, this.lastFilter)) {
        this.lastFilter = newFilter
        this.$emit('change')
      }
    },
    onFilterOptionSelect (item, option) {
      this.$set(item, 'value', option[item.valueKey])

      this.onFilterUpdate()
    },
    onStaticFilterInput: _.debounce(function () {
      this.onFilterUpdate()
    }, 400),
    onFilterUpdate () {
      const newFilter = this.calcNewFilter()
      if (!_.isEqual(newFilter, this.lastFilter)) {
        this.lastFilter = newFilter
        this.$emit('change')
      }
    },
    onClickDropdownHeader () {
      this.addFilterExpanded = false
    },
    onClickOutside () {
      this.addFilterExpanded = false
    }
  }
}
</script>

<style src="./base-multi-filter.scss" lang="scss" scoped></style>
