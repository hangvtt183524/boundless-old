<template lang="pug">
  .tags-input(:class="{ 'focused' : focused }")
    .input-wrap(
      v-if="!disabled"
    )
      v-text-field.tag-field.no-border(
        v-model="newTag"
        :placeholder="$t('settings.enterYourTags')"
        @keyup.enter="addTag"
        @focus="focused = true"
        @blur="focused = false"
        :rules="rules"
        :counter="maxLength"
        :maxlength="maxLength"
      )
      v-btn(round, large, outline, color="success", @click="addTag" :disabled="!newTag") {{ $t('general.add') }}
        v-icon(right) add_circle_outline
    v-layout.mt-4(row)
      v-flex(xs12).tags
        v-chip(v-for="(tag, index) in value", :key="index", :close="!disabled", @input='remove(index)')
          strong {{ tag }}
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      newTag: '',
      focused: false,
      maxLength: 20
    }
  },
  computed: {
    rules (v) {
      const maxRule = (v) => {
        let value = v
        if (!value) {
          value = {
            length: 0
          }
        }
        return value.length <= this.maxLength || this.$t('general.maxCharacters', { count: this.maxLength })
      }
      return [maxRule]
    }
  },
  methods: {
    addTag () {
      if (this.newTag && this.newTag.length <= this.maxLength) {
        this.$emit('input', [...this.value, this.newTag])
        this.newTag = ''
      }
    },
    remove (index) {
      let newArray = [...this.value]
      newArray.splice(index, 1)
      this.$emit('input', newArray)
    }
  }
}
</script>

<style lang="scss">
  .tags-input {
    .input-wrap {
      .tag-field {
        padding-top: 17px !important;
      }
    }
    .tags {
      max-height: 120px;
      overflow-x: hidden;
      .v-chip {
        background: #e3ecfc;
        color: #4b83f0;
        font-family: 'Fira Sans', sans-serif;
        font-size: 14px;
        padding: 5px 10px;
        margin: 8px 4px;

        i {
          font-size: 23px
        }
      }
    }

    .input-wrap {
      z-index: 1;
      display: flex;
      border: 1px solid #dce2ed;
      border-radius: 50px;
      justify-content: space-between;
      padding-left: 20px;
      align-items: center;
      position: relative;
      height: 44px;

      .v-btn {
        margin: 0;
        position: absolute;
        top: -1px;
        right: -1px;
      }

      .tag-field {
        padding-top: 25px;
        padding-right: 140px;
        .v-input__control {
          .v-input__slot {
            .v-text-field__slot {
              height: 40px;
              input {
                outline: none;
                height: 40px;
                font-size: 15px;
                flex: 1;
              }
            }
          }
          .v-input__slot:before {
            border-top: 0px !important;
            border-bottom: 0px !important;
          }
          .v-input__slot:after {
            border-top: 0px !important;
            border-bottom: 0px !important;
          }
          .v-input__slot .v-text-field__slot {
            align-items: center;
          }
        }
        .input-group__details {
          padding-top: 8px;
        }
      }
    }

    &.focused .input-wrap {
      border-color: darken(#dce2ed, 10%);
    }
  }
</style>
