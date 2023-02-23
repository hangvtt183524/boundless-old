<template lang="pug">
  .option-type
    label.option-label {{ $t('builder.selectOptions') }}
    .options-container
      .select-option(
        v-for="(option, index) in selectedItem.config.options"
        :class="{'focused': focused == index}"
      )
        input(
          v-if="selectOptionType === 'RAW'"
          type="text"
          v-model="selectedItem.config.options[index].translation[lang].label"
          class="form-control mt-2"
          @focus="focused = index"
          @blur="focused = -1"
          placeholder="Label"
        )
        input(
          v-if="selectOptionType === 'RAW'"
          type="text"
          v-model="selectedItem.config.options[index].value"
          class="form-control mt-2"
          @focus="focused = index"
          @blur="focused = -1"
          placeholder="Value"
        )
        input.label-only(
          v-if="selectOptionType === 'LABEL_ONLY'"
          type="text"
          v-model="selectedItem.config.options[index].translation[lang].label"
          @input="onChangeLabel(index)"
          @change="onChangeLabel(index)"
          class="form-control mt-2"
          @focus="focused = index"
          @blur="focused = -1"
          placeholder="Label"
        )
        input.value-before-unit(
          v-if="selectOptionType === 'VALUE_UNIT'"
          type="text"
          v-model="valueUnitOptions[index].value"
          @input="onChangeValueUnit(index)"
          @change="onChangeValueUnit(index)"
          class="form-control mt-2"
          @focus="focused = index"
          @blur="focused = -1"
          placeholder="Value"
        )
        multiselect(
          v-if="selectOptionType === 'VALUE_UNIT'"
          v-model="valueUnitOptions[index].unit"
          label="text"
          :options="translatedUnits"
          @input="onChangeValueUnit(index)"
          placeholder=""
          :show-labels="false"
        )
        .input-action(@click="removeOption(index)")
          v-icon fa-times-circle
    v-btn.ma-0.mt-2(small, round, color="success", @click="addOption") Add Option
</template>

<script>
import { cloneDeep } from 'lodash'
import languages from '../settings/translations/languages'

export default {
  props: ['selectedItem', 'lang', 'defaultLang'],
  data () {
    return {
      focused: -1,
      valueUnitOptions: this.calcValueUnitOptions(this.selectedItem)
    }
  },
  computed: {
    selectOptionType () {
      if (!this.selectedItem.config.builderOptionEditMode) {
        return 'RAW'
      }
      return this.selectedItem.config.builderOptionEditMode.type
    },
    translatedUnits () {
      return this.calcTranslatedUnits()
    }
  },
  watch: {
    selectedItem (newSelectedItem) {
      this.valueUnitOptions = this.calcValueUnitOptions(newSelectedItem)
    }
  },
  methods: {
    onChangeLabel (index) { // LABEL_ONLY - this is mainly used for numbers
      const config = this.selectedItem.config
      const lang = this.lang || this.defaultLang
      const curLabel = config.options[index].translation[lang].label
      // IMPLEMENTED FOR "CONVERTER": "PARSEINT"
      if (!isNaN(curLabel)) { // isNumber then update all the fields automatically
        languages.forEach(langInfo => {
          const localeCountry = langInfo.localeCountry
          if (config.options[index].translation[localeCountry]) {
            config.options[index].translation[localeCountry].label = curLabel
          }
        })
        config.options[index].value = parseInt(curLabel)
      } else {
        config.options[index].value = 0
      }
    },
    onChangeValueUnit (index) {
      try {
        const config = this.selectedItem.config
        const rawUnits = config.builderOptionEditMode.units
        const valueUnit = this.valueUnitOptions[index]
        const unitIndex = this.translatedUnits.findIndex(item => item.value === valueUnit.unit.value)

        let updatingOption = {
          value: valueUnit.value * valueUnit.unit.value,
          translation: {}
        }

        languages.forEach(langInfo => {
          const localeCountry = langInfo.localeCountry
          if (!updatingOption.translation[localeCountry]) {
            const unitTranslation = rawUnits[unitIndex].translation
            updatingOption.translation[localeCountry] = {
              label: `${valueUnit.value} ${(unitTranslation[localeCountry] || unitTranslation[this.defaultLang]).label}`
            }
          }
        })
        config.options[index] = updatingOption
      } catch (err) {
        console.error(err)
      }
    },
    addOption () {
      try {
        const defaultLang = this.defaultLang
        let newOption = {
          value: '',
          translation: {
            [defaultLang]: {
              label: '',
              value: ''
            }
          }
        }
        languages.forEach(langInfo => {
          const localeCountry = langInfo.localeCountry
          if (!newOption.translation[localeCountry]) {
            newOption.translation[localeCountry] = cloneDeep(newOption.translation[defaultLang])
          }
        })
        this.selectedItem.config.options.push(newOption)
        if (this.selectOptionType === 'VALUE_UNIT') {
          this.valueUnitOptions.push({
            value: '',
            unit: this.translatedUnits[0] // select first unit as default
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    removeOption (index) {
      try {
        this.selectedItem.config.options.splice(index, 1)
        this.valueUnitOptions.splice(index, 1)
      } catch (err) {
        console.error(err)
      }
    },
    calcTranslatedUnits () {
      try {
        const lang = this.lang || this.defaultLang
        const config = this.selectedItem.config
        if (!config.builderOptionEditMode) {
          return []
        }
        if (config.builderOptionEditMode.type !== 'VALUE_UNIT') {
          return []
        }
        return config.builderOptionEditMode.units.map(unit => {
          return {
            text: unit.translation[lang].label,
            value: unit.value
          }
        })
      } catch (err) {
        console.error(err)
      }
    },
    calcValueUnitOptions (selectedItem) {
      try {
        const config = selectedItem.config
        if (!config.builderOptionEditMode) {
          return []
        }
        if (config.builderOptionEditMode.type !== 'VALUE_UNIT') {
          return []
        }

        const lang = this.lang || this.defaultLang
        const result = config.options.map(option => {
          const labelSplit = option.translation[lang].label.split(' ')
          const optionUnitText = labelSplit[labelSplit.length - 1]
          const optionUnit = this.calcTranslatedUnits().find(unit => {
            return unit.text === optionUnitText
          })
          return {
            value: parseFloat(option.translation[lang].label),
            unit: optionUnit
          }
        })
        return result
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style lang="scss">
.page-builder {
  .select-option {
    position: relative;
    // overflow: hidden;
    input {
      width: 48% !important;
    }
    .label-only {
      width: 100% !important;
    }
    .value-before-unit {
      background: white;
      padding: 5px 5px;
      height: 38px !important;
    }
    .multiselect {
      width: 48% !important;
      position: absolute;
      right: 2px;
      top: 2px;
      padding: 3px;
      height: 26px;
      color: #9ba9c4;
    }
  }

  .select-option .input-action {
    transform: translateX(100px);
    transition: all 0.3s ease-in-out;
    visibility: hidden;
    position: absolute;
    right: 5px;
    top: 12px;
    cursor: pointer;
  }

  .select-option .input-action .v-icon {
    color: #ec5f59;
    font-size: 20px;
  }

  .select-option:hover .input-action,
  .select-option.focused .input-action {
    visibility: visible;
    transform: translateX(0);
  }
}
</style>
