<template lang="pug">
  .user-profile-info
    .user-profile-info__header
      .user-profile-info__header__title
        | {{ $t('v2.user.userDetails') }}
      .user-profile-info__header__actions
        .user-profile-info__header__action(
          v-if="hasPermission('workspace_users__edit_role', permissionCheckNodeId) && (mode === modes.internal || user.user_roles.length > 0)"
          @click="onRemoveClick"
        )
          span(
            v-if="mode === modes.workspace"
          ) {{ $t('v2.user.removeFromWorkspace') }}
          span(
            v-else
          ) {{ $t('v2.user.deleteUser') }}

    .user-profile-info__content
      .user-profile-info__content__field.name-field(
        v-if="mode === modes.internal"
      )
        .user-profile-info__content__field__label
          | {{ $t('v2.user.name') }}:
        .user-profile-info__content__field__value(
          v-if="nameUpdateData.isEditing"
        )
          base-text-input.base-text-input--small(
            :value="nameUpdateData.firstName"
            @input="$emit('firstNameInput', $event)"
            :validations="{ required: true }"
            :placeholder="$t('login.firstName')"
            :label="$t('login.firstName')"
          )
          base-text-input.base-text-input--small(
            :value="nameUpdateData.lastName"
            @input="$emit('lastNameInput', $event)"
            :validations="{ required: true }"
            :placeholder="$t('login.lastName')"
            :label="$t('login.lastName')"
          )
        .user-profile-info__content__field__value(
          v-if="!nameUpdateData.isEditing"
        )
          | {{ user.profile.full_name }}
          v-icon(
            @click="$emit('nameEditStateChange')"
          ) {{'$vuetify.icons.edit'}}

      .user-profile-info__content__field
        .user-profile-info__content__field__label
          | {{ $t('v2.user.email') }}:
        .user-profile-info__content__field__value
          | {{ user.email }}

      .user-profile-info__content__field
        .user-profile-info__content__field__label
          | {{ $t('v2.user.phone') }}:
        .user-profile-info__content__field__value
          | {{ user.profile.phone }}

      .user-profile-info__content__field
        .user-profile-info__content__field__label
          | {{ $t('v2.user.position') }}:
        .user-profile-info__content__field__value
          | {{ user.profile.job_title }}
</template>

<script>
import UserPermissionsMixin from '@/mixins/user-permissions.mixin'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'

export default {
  name: 'user-profile-info',
  mixins: [
    UserPermissionsMixin,
    CurrentNodeSelectionsMixin
  ],
  components: {
    BaseTextInput
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'workspace'
    },
    nameUpdateData: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      modes: {
        internal: 'internal',
        workspace: 'workspace'
      }
    }
  },
  computed: {
    permissionCheckNodeId () {
      return this.workspaceId
    }
  },
  methods: {
    onRemoveClick () {
      this.$emit('removeUserClick')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .user-profile-info {
    &__header {
      height: 38px;
      line-height: 38px;
      padding: 0 14px;
      background-color: $gray-xlight;
      overflow: hidden;

      &__title {
        float: left;
        font-family: Fira Sans;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: $text-dark;
      }

      &__actions {
        float: right;
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
        }

        .base-text-input {
          display: inline-block;
          width: calc(100% - 60px);
          margin-left: 10px;
        }

        &.name-field {
          .base-text-input {
            float: right;
          }
        }
      }
    }
  }
</style>
