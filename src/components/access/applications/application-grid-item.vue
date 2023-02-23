<template lang="pug">
  .application-item.application-item--connected(
    @click="onApplicationClick"
  )
    .application-item__actions
      .application-item__actions__action.checkbox-container(
        v-if="selectable"
      )
        base-check-box.base-check-box--small(
          data-test="media-item-checkbox"
          :value="isSelected"
          @input="onApplicationSelectionChange"
        )
      multi-action.application-item__actions__action.multi-action--small(
        v-if="actions && actions.length > 0"
        icon="fa fa-cog"
        :actions="actions"
        @actionClick="onActionClick"
      )

    v-tooltip(
      bottom color="#223d70" light
    )
      template(
        v-slot:activator="{ on }"
      )
        .application-item__content(
          v-on="on"
        )
          .application-item__organization-logo(
            :class="[{ 'no-square-bg': isNoTransparentBackground }]"
          )
            .application-item__organization-logo__image-wrapper
              img(
                :src="organizationLogoUrl"
              )

          .application-item__details
            .application-item__details__name-container
              | {{ application.name }}

      span {{ $t('v2.access.clickToLoginToOrganization').replace('{organization_name}', application.name) }}

</template>

<script>
import BaseCheckBox from '@/components/v2/base-check-box/base-check-box'
import MultiAction from '@/components/v2/multi-action/multi-action'

export default {
  components: {
    MultiAction,
    BaseCheckBox
  },
  props: {
    application: {
      type: Object,
      required: true
    },
    selectedApplications: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectable: {
      type: Boolean,
      default: true
    },
    actions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    isSelected () {
      return this.selectedApplications.indexOf(this.application) > -1
    },
    organizationLogoUrl () {
      return this.application.logo_url || require('@/assets/images/meraki-logo.png')
    },
    isNoTransparentBackground () {
      return !!/([^/]*)\.(jpg|jpeg|tiff)$/i.exec(this.organizationLogoUrl)
    }
  },
  methods: {
    onApplicationSelectionChange (event) {
      this.$emit('selectionChange')
    },
    selectFile (e, file) {
      this.$emit('selectFile', e, file)
    },
    onApplicationClick () {
      this.$emit('click')
    },
    onActionClick (actionKey) {
      this.$emit('actionClick', actionKey)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/colors.scss";
  @import "../../../styles/v2/colors.scss";

  .application-item {
    flex: 1;
    max-width: 220px;
    margin: 5px;
    border: 2px solid #EFF3F8;
    position: relative;

    &__actions {
      position: absolute;
      z-index: 1;
      top: 8px;
      right: 8px;

      .checkbox-container {
        padding: 3px;
        border-radius: 2px;
        background-color: white;
        transition: all 0.2s ease-in-out;
        height: 22px;
      }

      &__action {
        display: inline-block;
        cursor: pointer;
        margin-left: 5px;
      }
    }

    &__details {
      padding: 11px 14px 9px 14px;
      background: $gray-xlight;

      &__name-container {
        display: block;
        width: 100%;
        flex: 2;

        font-family: Fira Sans;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #53575A;
      }
    }

    &__organization-logo {
      background-image: url('~@/assets/images/pattern-bg.png');
      background-repeat: repeat;
      width: 216px;
      height: 150px;
      position: relative;

      &__image-wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        padding: 0 10px;
        background: linear-gradient(180deg, rgba(#EFF3F8, 0.4) 0%, rgba(#CED8E6, 0.4) 100%);
        height: 100%;

        img {
          position: relative;
          top:50%;
          left:50%;
          max-width:calc(100% - 2px);
          max-height:calc(100% - 2px);
          -webkit-transform:translate(-50%,-50%);
          -moz-transform:translate(-50%,-50%);
          -ms-transform:translate(-50%,-50%);
          -o-transform:translate(-50%,-50%);
          transform: translate(-50%,-50%);
        }
      }
      &.no-square-bg {
        background: none;
        .image-wrapper {
          background: none;
          overflow: hidden;

          img {
            width: calc(100% - 2px);
            max-height: unset;
          }
        }
      }
    }

    &--connected {
      cursor: pointer;
    }
  }
</style>
