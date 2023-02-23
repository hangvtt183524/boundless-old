<template lang="pug">
  .base-column-selector(v-click-outside='onClickOutside')
    .base-column-selector__activator(
      @click="onOpenDialog"
    ) {{ $t('v2.merakiClients.selectColumns') }}
    transition(name='slide')
      .base-column-selector__dialog(v-show="dialogExpanded")
        .base-column-selector__dialog__header {{ $t('v2.merakiClients.selectColumns') }}
        .base-column-selector__dialog__body(v-if="!isTree")
          .base-column-selector__dialog__body__item(
            v-for="column in columns"
            v-if="column.text && column.text !== 'actions' && column.text !== $t('general.reload')"
            :key="column.value"
            @click="column.selected = !column.selected"
          )
            base-check-box.base-check-box--small(
              v-model="column.selected"
              :label="column.text"
            )
        .base-column-selector__dialog__body(v-if="isTree")
          v-treeview(
            :items="treeData"
            multiple-active
            selectable
            v-model="values")
</template>

<script>
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'

export default {
  props: ['columns', 'isTree', 'treeData', 'treeValues'],
  components: {
    BaseCheckBox
  },
  data () {
    return {
      menu: false,
      values: [],
      dialogExpanded: false
    }
  },
  watch: {
    values (v, oldValue) {
      this.$emit('change', v)
    },
    treeValues (v, oldValue) {
      this.values = v
    }
  },
  methods: {
    onOpenDialog () {
      this.dialogExpanded = true
    },
    onClickOutside () {
      this.dialogExpanded = false
    }
  }
}
</script>

<style lang="scss">
  @import "styles/colors.scss";
  @import "styles/v2/colors.scss";

  .base-column-selector {
    &__activator {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 60px;
      -webkit-text-decoration-line: underline;
      text-decoration-line: underline;
      color: #1146ae;
      cursor: pointer;
    }
    &__dialog {
      position: absolute;
      top: 20px;
      right: 0;
      width: 279px;
      padding: 0 0 11px 0;
      font-size: 15px;
      line-height: 41px;
      text-align: left;
      background: #fff;
      border: 2px solid #1c51ba;
      box-sizing: border-box;
      border-radius: 4px;

      &__header {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        color: #1146ae;
        padding: 0 13px;
      }
      &__body {
        max-height: 315px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
          background: #C8CCD5;
          opacity: 0.5;
          border-radius: 6px;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
          background: #8796B2;
          border-radius: 6px;
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        &__item {
          padding: 0 13px;
          line-height: 35px;
          height: 35px;

          .base-check-box--small .check-box-display {
            margin: 10px 0 0 0;
          }
          label {
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 41px;
            color: #4F4F4F;
          }

          &:nth-child(2n + 1) {
            background: #EFF3F8;
          }
          &:nth-child(2n) {
            background: $white;
          }
        }
      }
    }
  }
</style>
