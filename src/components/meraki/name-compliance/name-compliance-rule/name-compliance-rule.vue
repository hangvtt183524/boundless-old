<template lang="pug">
  .name-compliance-rule
    v-layout(row wrap).name-compliance-rule__row
      v-flex(xs5 md2 lg2 xl1)
        label {{ $t('v2.nameCompliance.operator') }}
      v-flex(xs6 md3 lg3 xl2).name-compliance-rule__row__input-column
        base-select.operator-select(
          :items="operatorOptions"
          :value="value.operator"
          @input="onFieldInput('operator', $event)"
          :validations="{ required: true }"
          :disabled="isFixed"
        )

    v-layout(
      v-if="value.operator === 'in_list'"
      row wrap
    ).name-compliance-rule__row.value-row
      v-flex(xs5 md2 lg2 xl1)
        label {{ $t('v2.nameCompliance.allowedNames') }}
      v-flex(xs6 md4 lg4 xl3).name-compliance-rule__row__input-column
        base-text-area(
          v-if="nameInputMode === nameInputModes.manual"
          :value="nameListValue"
          @input="onNameListValueInput"
          :placeholder="$t('v2.nameCompliance.allowedNamesPlaceholder')"
          :rows="6"
          :disabled="isFixed"
        )

        v-dropzone(
          v-if="nameInputMode === nameInputModes.fileUpload"
          :options="dropZoneOptions"
          @file-added="onFileAdd"
          @removed-file="onFileRemove"
          ref="fileDropZone"
        )

        .name-compliance-rule__name-input-mode-toggle(
          @click="onNameInputModeToggle"
        )
          span(
            v-show="nameInputMode === nameInputModes.manual"
          ) {{ $t('v2.nameCompliance.uploadFile') }}
          span(
            v-show="nameInputMode === nameInputModes.fileUpload"
          ) {{ $t('v2.nameCompliance.enterManually') }}

        .name-compliance-rule__sample-names(
          v-if="isSaved && value.name_options_count && (value.name_options_count > 0)"
        )
          span.name-compliance-rule__sample-names__label
            | {{ $t('v2.nameCompliance.sampleNames') }}:
          span.name-compliance-rule__sample-names__name-list
            span.name-compliance-rule__sample-names__sample-name(
              v-for="name of value.sample_name_options"
              :key="name"
            ) {{ name }}
          span.name-compliance-rule__sample-names__total
            | ({{ value.name_options_count }} {{ $t('v2.nameCompliance.total') }})

    v-layout(
      v-if="value.operator !== 'in_list'"
      row wrap
    ).name-compliance-rule__row.value-row
      v-flex(xs5 md2 lg2 xl1)
        label {{ $t('v2.merakiTemplates.value') }}

      v-flex(xs7 md9 lg8 xl6).name-compliance-rule__row__input-column
        base-text-input(
          :value="value.value"
          @input="onFieldInput('value', $event)"
          :validations="{ required: true }"
          :disabled="isFixed"
        )

        .name-compliance-rule__sample-regex-value(
          v-if="(value.operator === 'matches_regex') && samplePatternValue && !isFixed"
        )
          span.name-compliance-rule__sample-regex-value__label
            | {{ $t('v2.nameCompliance.sampleValue') }}:
          span {{ samplePatternValue }}

      v-flex(
        xs12 md10 lg10 xl7
        v-if="value.operator === 'matches_pattern'"
      )
        .name-compliance-rule__pattern-elements
          name-compliance-rule-pattern-element(
            v-for="(patternElement, index) of value.pattern_elements || []"
            :key="index"
            :value="patternElement"
            :is-fixed="isFixed"
            @input="onPatternElementInput(index, $event)"
            @deleteClick="onPatternElementDeleteClick(index)"
            @nameBlur="onPatternElementNameBlur(patternElement)"
            ref="patternElements"
          )

        span.name-compliance-rule__pattern-elements__add-chart-item-trigger(
          v-if="!isFixed"
          @click="onAddPatternElementClick"
        ) + {{ $t('general.addNew') }}

    .name-compliance-rule__actions(
      v-if="!isFixed"
    )
      v-icon.name-compliance-rule__actions__action(
        @click="onDeleteRuleClick"
      ) $vuetify.icons.delete

</template>

<script>
import _ from 'lodash'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSelect from '@/components//v2/base-select/base-select'
import BaseTextArea from '@/components/v2/base-text-area/base-text-area'
import VDropzone from '@/components/common/v-dropzone'
import NameComplianceRulePatternElement from '../name-compliance-rule-pattern-element/name-compliance-rule-pattern-element'
import { escapeRegex } from '@/utils/functions'

export default {
  name: 'name-compliance-rule',
  components: {
    BaseTextArea,
    BaseSelect,
    BaseTextInput,
    NameComplianceRulePatternElement,
    VDropzone
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    isFixed: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      operatorOptions: ['matches_pattern', 'equals', 'starts_with', 'ends_with', 'contains', 'not_contains',
        'matches_regex', 'in_list'].map(operator => {
        return {
          key: operator,
          name: this.$t(`v2.nameCompliance.operators.${operator}`)
        }
      }),
      nameInputModes: {
        manual: 'manual',
        fileUpload: 'fileUpload'
      },
      nameInputMode: 'manual',
      dropZoneOptions: {
        url: '/api/mock/url/',
        dictDefaultMessage: '<i class="fas fa-cloud-upload-alt"></i> ' + this.$t('v2.nameCompliance.optionsNameFileUpload'),
        autoProcessQueue: false // Do not upload automatically
      }
    }
  },
  computed: {
    isSaved () {
      return !!this.value && !!this.value.id
    },
    nameListValue () {
      return (this.value && this.value.name_list) ? this.value.name_list.join('\n') : null
    },
    samplePatternValue () {
      // Note: Sample value hidden for matches_pattern rules as we can not correctly generate digit min / max values

      if (this.value.operator !== 'matches_regex' && this.value.operator !== 'matches_pattern') {
        return ''
      }

      const regexValue = this.value.operator === 'matches_regex' ? this.value.value : this.getPatternRegexValue()

      if (!regexValue) {
        return ''
      }

      try {
        RegExp(regexValue)
      } catch (e) {
        return ''
      }

      // We have a valid regex
      const randExp = new global.RandExp(regexValue)
      randExp.max = 8

      return randExp.gen()
    },
    selectedOperator () {
      return this.value.operator
    }
  },
  watch: {
    selectedOperator (newVal) {
      // If switching to pattern type, add initial empty pattern element
      if (newVal === 'matches_pattern' && !this.value.pattern_elements) {
        this.onAddPatternElementClick()
      } else {
        // Remove pattern elements for other types of rules
        this.$emit('fieldInput', 'pattern_elements', null)
      }
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('fieldInput', field, value)
    },
    onNameListValueInput (value) {
      this.$emit('fieldInput', 'name_list', value.split(/\r?\n/))
    },
    onDeleteRuleClick () {
      this.$emit('deleteClick')
    },
    onNameInputModeToggle () {
      if (this.nameInputMode === this.nameInputModes.manual) {
        this.$set(this, 'nameInputMode', this.nameInputModes.fileUpload)

        // Reset manual name list on switch to file upload
        this.$emit('fieldInput', 'name_list', [])
      } else {
        this.$set(this, 'nameInputMode', this.nameInputModes.manual)

        // Reset file on switch to manual input
        this.$emit('fieldInput', 'file', null)
      }
    },
    onFileAdd (file) {
      this.$emit('fieldInput', 'file', file)
    },
    onFileRemove () {
      this.$emit('fieldInput', 'file', null)
    },
    getEmptyPatternElement () {
      return {
        name: null,
        mode: 'dynamic',
        character_sets: [],
        min_length: null,
        max_length: null
      }
    },
    onAddPatternElementClick () {
      this.$emit('fieldInput', 'pattern_elements', [
        ...(this.value.pattern_elements || []),
        this.getEmptyPatternElement()
      ])

      // Automatically set focus on newly added pattern element name input
      setTimeout(() => {
        this.$refs.patternElements[this.$refs.patternElements.length - 1].setNameFocus()
      }, 100)
    },
    onPatternElementInput (itemIndex, itemValue) {
      this.$emit('fieldInput', 'pattern_elements', this.value.pattern_elements.map((item, index) => {
        if (index === itemIndex) {
          return itemValue
        } else {
          return item
        }
      }))
    },
    onPatternElementDeleteClick (itemIndex) {
      this.$emit('fieldInput', 'pattern_elements', this.value.pattern_elements.filter((item, index) => {
        return itemIndex !== index
      }))

      // If last item is deleted, add an empty item
      if (!this.value.pattern_elements || this.value.pattern_elements.length === 0) {
        this.onAddPatternElementClick()
      }

      // Now update value to clear all non-existing pattern names
      this.removeInvalidPatternVariables()
    },
    onPatternElementNameBlur (itemValue) {
      // First, add the new variable to pattern value, if not already there
      const patternValue = this.value.value || ''
      if (itemValue.name && patternValue.indexOf(`{${itemValue.name}}`) === -1) {
        this.$emit('fieldInput', 'value', `${patternValue}{${itemValue.name}}`)
      }

      // Now update value to clear all non-existing pattern names
      this.removeInvalidPatternVariables()
    },
    removeInvalidPatternVariables () {
      if (!this.value) {
        return
      }

      const validPatternVariables = this.value.pattern_elements.map(patternElement => patternElement.name)
      const patternVariableRegex = /{([^}]+)}/g
      let matchData = patternVariableRegex.exec(this.value.value)
      while (matchData) {
        if (validPatternVariables.indexOf(matchData[1]) === -1) {
          this.$emit('fieldInput', 'value', this.value.value.replaceAll(`{${matchData[1]}}`, ''))
        }

        matchData = patternVariableRegex.exec(this.value.value)
      }
    },
    getPatternRegexValue () {
      const patternValue = this.value.value || ''
      let regex = ''
      let currentPatternVariable = null

      for (let i = 0; i < patternValue.length; i++) {
        const character = patternValue[i]

        if (character === '{') {
          // Starting a new pattern
          if (currentPatternVariable !== null) {
            // Was already going through a pattern. Invalid.
            return ''
          }

          // Start the current pattern with new character
          currentPatternVariable = ''
        } else if (character === '}') {
          // Ending pattern
          if (currentPatternVariable === null) {
            // Got pattern end for an un-started pattern. Invalid.
            return ''
          }

          // Add pattern to regex
          const patternElement = this.value.pattern_elements.find(patternElement => patternElement.name === currentPatternVariable)
          if (!patternElement) {
            // Pattern variable not defined. Invalid.
            return ''
          }

          regex += this.getPatternVariableRegex(patternElement)
          currentPatternVariable = null
        } else {
          // Regular character. Extend current pattern if we are on one. Otherwise extend regex with constant character.
          if (currentPatternVariable !== null) {
            currentPatternVariable += character
          } else {
            regex += escapeRegex(character)
          }
        }
      }

      return regex
    },
    getPatternVariableRegex (patternElement) {
      let characterPptions = ''
      const specialCharacters = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~' // Value of Python string.punctuation

      if (patternElement.character_sets.indexOf('lowercase') > -1) {
        characterPptions += 'a-z'
      }

      if (patternElement.character_sets.indexOf('uppercase') > -1) {
        characterPptions += 'A-Z'
      }

      if (patternElement.character_sets.indexOf('digits') > -1) {
        characterPptions += '0-9'
      }

      if (patternElement.character_sets.indexOf('special') > -1) {
        characterPptions += escapeRegex(specialCharacters)
      }

      let regex = `[${characterPptions}]`

      if (!_.isNil(patternElement.min_length) && patternElement.min_length !== '' &&
        !_.isNil(patternElement.max_length) && patternElement.max_length !== '') {
        regex = `${regex}{${patternElement.min_length},${patternElement.max_length}}`
      } else if (!_.isNil(patternElement.min_length) && patternElement.min_length !== '') {
        regex = `${regex}{${patternElement.min_length},}`
      } else if (!_.isNil(patternElement.max_length) && patternElement.max_length !== '') {
        regex = `${regex}{, ${patternElement.max_length}}`
      } else {
        regex = `${regex}+`
      }

      return regex
    }
  }
}
</script>

<style src="./name-compliance-rule.scss" lang="scss" scoped></style>
