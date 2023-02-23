<template lang='pug'>
  .inline-edit-cell
    .inline-edit-cell__value(
      v-show="!editing"
    )
      span {{ displayValue }}
      v-tooltip(
        right color="#223d70" light
      )
        template(v-slot:activator="{ on }")
          v-icon(
            @click="onEditClick"
            v-on="on"
          ).inline-edit-cell__edit-icon $vuetify.icons.edit
        span {{ tooltip ? tooltip : $t('general.clickToUpdate') }}

    .inline-edit-cell__input(
      v-show="editing"
    )
      base-text-input.base-text-input--small(
        v-model="inputValue"
        ref="input"
        @enterKeyUp="onUpdateClick"
      )
        v-icon(
          v-show="!loading"
          @click="onUpdateClick"
        ).inline-edit-cell__input__check-icon check
        v-progress-circular.inline-edit-cell__loading-indicator(
          v-if="loading"
          :size="16"
          indeterminate
        )
        v-icon(
          @click="onCloseClick"
        ).inline-edit-cell__input__close-icon close

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  name: 'inline-edit-cell',
  components: { BaseTextInput },
  props: {
    value: {
      required: true
    },
    item: {
      type: Object
    },
    tooltip: {
      type: String,
      required: false
    },
    maxDisplayCharacters: {
      type: Number,
      required: false
    }
  },
  data: function () {
    return {
      loading: false,
      editing: false,
      inputValue: null
    }
  },
  mounted () {
    this.inputValue = this.value
  },
  computed: {
    displayValue () {
      const value = this.value || ''
      return !this.maxDisplayCharacters
        ? value
        : value.substring(0, this.maxDisplayCharacters) + (value.length > this.maxDisplayCharacters ? '...' : '')
    }
  },
  methods: {
    onEditClick () {
      this.editing = true

      setTimeout(() => {
        this.$refs.input.setFocus()
      }, 50)
    },
    onCloseClick () {
      this.inputValue = this.value
      this.editing = false
    },
    onUpdateClick () {
      this.$emit('action', {
        type: 'update',
        value: this.inputValue
      })

      this.editing = false
    }
  }
}
</script>

<style lang="scss">
  @import "styles/v2/colors.scss";

  .inline-edit-cell {
    &__value {
      span, .v-icon {
        vertical-align: middle;
      }
    }

    &__edit-icon {
      display: inline;
      transition: none;
      margin-left: 10px;
      font-size: 14px;
      position: relative;
      top: 2px;
      color: #9ba9c4 !important;
    }

    &__input {
      .base-text-input {
        max-width: 240px;

        input {
          padding: 4px 60px 4px 13px;

          &:focus {
            padding: 3px 59px 3px 12px;
          }
        }
      }

      &__check-icon {
        right: 31px !important;
        width: 20px;
        height: 20px;
        border: 1px solid $green-medium;
        color: $green-medium;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 16px;
      }

      &__close-icon {
        width: 20px;
        height: 20px;
        border: 1px solid $gray-dark;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 16px;
      }
    }

    &__loading-indicator {
      position: absolute;
      right: 31px !important;
      top: 6px;
      width: 14px;
      height: 14px;
      color: $green-medium;
    }
  }

  // v-data-table overrides
  table.v-table tbody tr.v-datatable__expand-row:hover {
    .inline-edit-cell {
      &__edit-icon {
        color: #9ba9c4 !important;
      }
    }

    tr:not(.v-datatable__expand-row):hover {
      .inline-edit-cell {
        &__edit-icon {
          color: $blue-dark !important;
        }
      }
    }
  }
</style>
