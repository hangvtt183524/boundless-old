<template lang="pug">
  .organization-info
    .organization-info__header
      .organization-info__header__title(
        :title="$t('v2.workspaces.organizations.organizationDetails')"
      )
        | {{ $t('v2.workspaces.organizations.organizationDetails') }}

    .organization-info__content
      .organization-info__content__field
        .organization-info__content__field__label
          | {{ $t('v2.user.name') }}:
        .organization-info__content__field__value(
          v-if="nameUpdateData.isEditing"
        )
          base-text-input.base-text-input--small(
            :value="nameUpdateData.value"
            @input="$emit('nameInput', $event)"
            :validations="{ required: true }"
          )
          v-icon.close-icon(
            @click="$emit('nameEditStateChange')"
          ) close
        .organization-info__content__field__value(
          v-if="!nameUpdateData.isEditing"
        )
          | {{ workspaceOrganization.name }}
          v-icon(
            @click="$emit('nameEditStateChange')"
          ) {{'$vuetify.icons.edit'}}

      .organization-info__content__field
        .organization-info__content__field__action.delete-organization(
          @click="onDeleteFromSystemClick"
        ) {{ $t('v2.workspaces.organizations.deleteFromSystem') }}

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  name: 'organization-info',
  components: {
    BaseTextInput
  },
  props: {
    workspaceOrganization: {
      type: Object,
      required: true
    },
    nameUpdateData: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDeleteFromSystemClick () {
      this.$emit('deleteFromSystemClick')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .organization-info {
    &__header {
      height: 38px;
      line-height: 38px;
      padding: 0 14px;
      background-color: $gray-xlight;
      overflow: hidden;
      position: relative;

      &__title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: $text-dark;

        margin-right: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &__actions {
        position: absolute;
        right: 14px;
        top: 0;
      }

      &__action {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;

        text-align: right;
        text-decoration-line: underline;
        color: $blue-reserve;
        cursor: pointer;
      }
    }

    &__content {
      padding: 0 14px;

      &__field {
        line-height: 36px;
        font-family: Fira Sans;
        font-style: normal;
        font-size: 15px;
        color: $text-medium;

        &__label {
          font-weight: 600;
          margin-right: 5px;
          display: inline;
        }

        &__value {
          display: inline;
        }

        .v-icon {
          font-size: 15px;
          width: 30px;
          height: 30px;
          float: right;

          &.close-icon {
            font-size: 18px;
            margin-top: 2px;
          }
        }

        .base-text-input {
          display: inline-block;
          width: calc(100% - 90px);
          margin-left: 10px;
        }

        &__action {
          font-family: Fira Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 15px;

          text-decoration-line: underline;
          cursor: pointer;

          &.delete-organization {
            color: $text-warning;
          }
        }
      }
    }
  }
</style>
