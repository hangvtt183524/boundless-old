<template lang="pug">
  v-container(
    grid-list-md
  )
    v-layout(row)
      v-flex(xs12)
        p {{ $t('settings.establishmentInformationDescription') }}
    v-layout.card.pa-3(row wrap)
      v-flex(xs12 md6 px-3)
        node-name-input(
          data-test="site-name"
          :error-messages="validateErrors('name')"
          :label="$t('settings.facilityName')"
          required
          v-model="value.name"
          @input="$v.value.name.$touch()"
          @blur="$v.value.name.$touch()"
        )

      v-flex(xs12 md6 px-3)
        node-select(
          data-test="site-group"
          :indent-level="0"
          :node-types="['organization', 'group']"
          :label="$t('settings.selectGroup')"
          clearable
          search-enabled
          v-model="value.parent"
        )

      v-flex(xs12 md6 px-3)
        v-autocomplete.site-timezone(
          data-test="site-timezone"
          :error-messages="validateErrors('timezone')"
          :items="timezoneChoices"
          :label="$t('settings.selectTimeZone')"
          item-text="display_name"
          required
          v-model='value.timezone'
          :menu-props="{ maxHeight: 200 }"
          @input="$v.value.timezone.$touch()"
          @blur="onTimezoneSelectorBlur()"
          ref="timezoneSelector"
        )

</template>

<script>
import { maxLength, required } from 'vuelidate/lib/validators'

import ManageableNodesMixin from '@/mixins/manageable-nodes.mixin'
import ErrorHandlerMixin from '@/mixins/error-handler.mixin'
import SiteDetailMixin from '@/mixins/site-detail.mixin'

import NodeSelect from '@/components/common/node-select'

function isCorrectName () {
  if (this.value.name.trim()) {
    return true
  }
  return false
}

export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          name: '',
          parent: null,
          timezone: ''
        }
      }
    }
  },

  mixins: [
    ManageableNodesMixin,
    ErrorHandlerMixin,
    SiteDetailMixin
  ],

  components: {
    NodeSelect
  },

  validations: {
    value: {
      name: {
        required,
        maxLength: maxLength(64),
        isCorrectName
      },
      timezone: {
        required
      }
    }
  },
  methods: {
    validateErrors (fieldName) {
      const errors = []
      const name = this.$v.value[fieldName]
      if (!name.$dirty) return errors
      !name.required && errors.push(this.$t('errors.required'))
      fieldName === 'name' && !name.isCorrectName && errors.push(this.$t('errors.name'))
      return errors
    },
    isValid () {
      return !this.$v.value.$invalid
    },
    onTimezoneSelectorBlur () {
      this.$v.value.timezone.$touch()

      // Close the menu manually, since it is not closed automatically
      this.$refs.timezoneSelector.isMenuActive = false
    }
  }
}
</script>
