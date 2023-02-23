<template lang="pug">
  .name-compliance-rule-pattern-element
    v-layout(row wrap)
      v-flex.name-compliance-rule-pattern-element__pattern-name-container(
        xs6 md4 lg3
      )
        base-text-input.base-text-input--small.base-text-input--multiline(
          :value="value.name"
          :label="$t('v2.nameCompliance.patternElementName')"
          :placeholder="$t('v2.nameCompliance.patternNamePlaceholder')"
          :validations="patternNameValidations"
          :disabled="isFixed"
          @input="onFieldInput('name', $event)"
          @blur="onNameBlur()"
          ref="name"
        )
      v-flex(xs6 md8 lg9)
        .name-compliance-rule-pattern-element__actions(
          v-if="!isFixed"
        )
          v-icon.name-compliance-rule-pattern-element__actions__action(
            @click="onDeletePatternElementClick"
          ) $vuetify.icons.delete

    v-layout(row wrap).mt-4
      v-flex(xs6 md4 lg4)
        .name-compliance-rule-pattern-element__character-sets
          .name-compliance-rule-pattern-element__character-sets__character-set(
            v-for="characterSet of patternCharacterSetOptions"
            :key="characterSet"
          )
            base-check-box(
              :value="value.mode === valueModes.dynamic && value.character_sets.indexOf(characterSet) > -1"
              :label="$t(`v2.nameCompliance.characterSetOptions.${characterSet}`)"
              @input="onCharacterSetInput(characterSet, $event)"
            )

          .name-compliance-rule-pattern-element__character-sets__character-set.fixed-list
            base-check-box(
              :value="value.mode === valueModes.fixed"
              :label="$t('v2.nameCompliance.fixedList')"
              @input="onFixedListInput($event)"
            )

      v-flex(xs6 md8 lg8)
        v-layout(
          v-show="value.mode === valueModes.dynamic && !isOnlyDigits"
          row wrap
        ).name-compliance-rule-pattern-element__parameters.length-mode-row
          v-flex(xs6 lg5 xl4).name-compliance-rule-pattern-element__parameters__parameter
            base-radio(
              v-model="lengthMode"
              :radio-value="lengthModes.fixed"
              :label="$t('v2.nameCompliance.fixedLength')"
            )
          v-flex(xs6 lg5 xl4).name-compliance-rule-pattern-element__parameters__parameter
            base-radio(
              v-model="lengthMode"
              :radio-value="lengthModes.variable"
              :label="$t('v2.nameCompliance.variableLength')"
            )

        v-layout(
          v-show="value.mode === valueModes.dynamic"
          row wrap
        ).name-compliance-rule-pattern-element__parameters
          v-flex(
            v-show="lengthMode === lengthModes.variable"
            xs6 md4
          ).name-compliance-rule-pattern-element__parameters__parameter
            base-text-input.base-text-input--small.base-text-input--multiline(
              type="number"
              :value="value.min_length"
              :label="isOnlyDigits ? $t('v2.nameCompliance.minValue') : $t('v2.nameCompliance.minLength')"
              :placeholder="$t('v2.nameCompliance.minLengthPlaceholder')"
              :validations="isOnlyDigits ? valueRangeFieldValidations : lengthRangeFieldValidations"
              :disabled="isFixed"
              :min="isOnlyDigits ? rangeLimits.digits.min : rangeLimits.characters.min"
              :max="isOnlyDigits ? rangeLimits.digits.max : rangeLimits.characters.max"
              @input="onFieldInput('min_length', $event)"
            )

          v-flex(
            v-show="lengthMode === lengthModes.variable"
            xs6 md4
          ).name-compliance-rule-pattern-element__parameters__parameter
            base-text-input.base-text-input--small.base-text-input--multiline(
              type="number"
              :value="value.max_length"
              :label="isOnlyDigits ? $t('v2.nameCompliance.maxValue') : $t('v2.nameCompliance.maxLength')"
              :placeholder="$t('v2.nameCompliance.maxLengthPlaceholder')"
              :validations="isOnlyDigits ? valueRangeFieldValidations : lengthRangeFieldValidations"
              :disabled="isFixed"
              :min="isOnlyDigits ? rangeLimits.digits.min : rangeLimits.characters.min"
              :max="isOnlyDigits ? rangeLimits.digits.max : rangeLimits.characters.max"
              @input="onFieldInput('max_length', $event)"
            )

          v-flex(
            v-show="lengthMode === lengthModes.fixed"
            xs6 md4
          ).name-compliance-rule-pattern-element__parameters__parameter
            base-text-input.base-text-input--small.base-text-input--multiline(
              type="number"
              v-model="fixedLength"
              :label="$t('v2.nameCompliance.length')"
              :placeholder="$t('v2.nameCompliance.fixedLengthPlaceholder')"
              :validations="isOnlyDigits ? valueRangeFieldValidations : lengthRangeFieldValidations"
              :disabled="isFixed"
              :min="isOnlyDigits ? rangeLimits.digits.min : rangeLimits.characters.min"
              :max="isOnlyDigits ? rangeLimits.digits.max : rangeLimits.characters.max"
              @input="onFieldInput('min_length', $event)"
            )

          v-flex(
            v-show="lengthMode === lengthModes.fixed"
            xs3 md2
          ).name-compliance-rule-pattern-element__parameters__parameter
            base-text-input.base-text-input--small.base-text-input--multiline(
              type="text"
              :value="value.padding_character"
              :label="$t('v2.nameCompliance.paddingCharacter')"
              :max-length="1"
              :disabled="isFixed"
              @input="onFieldInput('padding_character', $event)"
            )

        v-layout(
          v-if="value.mode === valueModes.fixed"
          row wrap
        ).name-compliance-rule-pattern-element__parameters
          v-flex(
            xs8 lg6
          ).name-compliance-rule-pattern-element__parameters__parameter
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

            .name-compliance-rule-pattern-element__parameters__parameter__name-input-mode-toggle(
              @click="onNameInputModeToggle"
            )
              span(
                v-show="nameInputMode === nameInputModes.manual"
              ) {{ $t('v2.nameCompliance.uploadFile') }}
              span(
                v-show="nameInputMode === nameInputModes.fileUpload"
              ) {{ $t('v2.nameCompliance.enterManually') }}

            .name-compliance-rule-pattern-element__parameters__parameter__sample-names(
              v-if="value.name_options_count && (value.name_options_count > 0)"
            )
              span.name-compliance-rule-pattern-element__parameters__parameter__sample-names__label
                | {{ $t('v2.nameCompliance.sampleNames') }}:
              span.name-compliance-rule-pattern-element__parameters__parameter__sample-names__name-list
                span.name-compliance-rule-pattern-element__parameters__parameter__sample-names__sample-name(
                  v-for="name of value.sample_name_options"
                  :key="name"
                ) {{ name }}
              span.name-compliance-rule-pattern-element__parameters__parameter__sample-names__total
                | ({{ value.name_options_count }} {{ $t('v2.nameCompliance.total') }})

</template>

<script>
import _ from 'lodash'
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import BaseRadio from '@/components/v2/base-radio/base-radio'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseTextArea from '@/components/v2/base-text-area/base-text-area'
import VDropzone from '@/components/common/v-dropzone'

export default {
  name: 'name-compliance-rule-pattern-element',
  components: {
    BaseCheckBox,
    BaseRadio,
    BaseTextInput,
    BaseTextArea,
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
      patternCharacterSetOptions: [
        'lowercase', 'uppercase', 'digits', 'special'
      ],
      valueModes: {
        dynamic: 'dynamic',
        fixed: 'fixed'
      },
      patternNameValidations: {
        required: true,
        methods: [{
          method: (value) => {
            return /^[a-zA-Z_][a-zA-Z_0-9]*$/.test(value)
          },
          message: this.$t('v2.nameCompliance.invalidPatternNameMessage')
        }]
      },
      valueRangeFieldValidations: {
        required: false,
        methods: [{
          method: (value) => {
            return value >= 0
          }
        }]
      },
      lengthRangeFieldValidations: {
        required: false,
        methods: [{
          method: (value) => {
            return value >= 1 && value <= 200
          }
        }]
      },
      lengthMode: 'fixed',
      lengthModes: {
        variable: 'variable',
        fixed: 'fixed'
      },
      fixedLength: null,
      nameInputModes: {
        manual: 'manual',
        fileUpload: 'fileUpload'
      },
      nameInputMode: 'manual',
      dropZoneOptions: {
        url: '/api/mock/url/',
        dictDefaultMessage: '<i class="fas fa-cloud-upload-alt"></i> ' + this.$t('v2.nameCompliance.optionsNameFileUpload'),
        autoProcessQueue: false // Do not upload automatically
      },
      rangeLimits: {
        digits: {
          min: 0,
          max: -1 // No limit
        },
        characters: {
          min: 1,
          max: 200
        }
      }
    }
  },
  mounted () {
    if (this.value.min_length !== this.value.max_length) {
      this.lengthMode = this.lengthModes.variable
    } else if (!!this.value.min_length && !!this.value.max_length && this.value.min_length === this.value.max_length) {
      this.fixedLength = this.value.min_length
    }
  },
  computed: {
    isOnlyDigits () {
      return this.value.character_sets.length === 1 && this.value.character_sets[0] === 'digits'
    },
    nameListValue () {
      return (this.value && this.value.name_list) ? this.value.name_list.join('\n') : null
    }
  },
  watch: {
    fixedLength (newVal) {
      this.onFieldInput('min_length', newVal)
      this.onFieldInput('max_length', newVal)
    },
    isOnlyDigits (newVal) {
      if (newVal) {
        // If switching to only digits, set length mode to variable
        this.lengthMode = this.lengthModes.variable
      }
    },
    value: {
      handler: function (newVal, oldVal) {
        // If switching from fixed to dynamic mode, and a file is present, remove it
        if (newVal && oldVal && newVal.mode === this.valueModes.dynamic && oldVal.mode === this.valueModes.fixed && newVal.file) {
          this.$emit('input', _.pickBy(this.value, (value, key) => {
            return key !== 'file'
          }))
        }
      },
      deep: true
    }
  },
  methods: {
    onFieldInput (field, value) {
      this.$emit('input', {
        ...this.value,
        [field]: value
      })
    },
    onCharacterSetInput (characterSet, value) {
      if (value) {
        this.$emit('input', {
          ...this.value,
          mode: this.valueModes.dynamic,
          character_sets: [
            ...this.value.character_sets,
            characterSet
          ]
        })
      } else {
        this.$emit('input', {
          ...this.value,
          character_sets: this.value.character_sets.filter(item => item !== characterSet)
        })
      }
    },
    onFixedListInput (value) {
      if (value) {
        this.$emit('input', {
          ...this.value,
          mode: this.valueModes.fixed,
          character_sets: []
        })
      } else {
        this.$emit('input', {
          ...this.value,
          mode: this.valueModes.dynamic
        })
      }
    },
    onNameListValueInput (value) {
      this.$emit('input', {
        ...this.value,
        name_list: value.split(/\r?\n/)
      })
    },
    onDeletePatternElementClick () {
      this.$emit('deleteClick')
    },
    onNameBlur () {
      this.$emit('nameBlur')
    },
    setNameFocus () {
      this.$refs.name.setFocus()
    },
    onNameInputModeToggle () {
      if (this.nameInputMode === this.nameInputModes.manual) {
        this.$set(this, 'nameInputMode', this.nameInputModes.fileUpload)

        // Reset manual name list on switch to file upload
        this.$emit('input', {
          ...this.value,
          name_list: []
        })
      } else {
        this.$set(this, 'nameInputMode', this.nameInputModes.manual)

        // Reset file on switch to manual input
        this.$emit('input', _.pickBy(this.value, (value, key) => {
          return key !== 'file'
        }))
      }
    },
    onFileAdd (file) {
      this.$emit('input', {
        ...this.value,
        file: file
      })
    },
    onFileRemove () {
      this.$emit('input', _.pickBy(this.value, (value, key) => {
        return key !== 'file'
      }))
    }
  }
}
</script>

<style src="./name-compliance-rule-pattern-element.scss" lang="scss" scoped></style>
