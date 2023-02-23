<template lang="pug">
  .server-configuration
    .server-configuration__header
      .server-configuration__header__title(
        :title="$t('v2.syslog.serverConfiguration')"
      )
        | {{ $t('v2.syslog.serverConfiguration') }}

      .server-configuration__header__actions
        v-icon.server-configuration__header__actions__action(
          v-if="isExistingServer && isUpdateEnabled"
          @click="onEditToggleClick"
        )
          | {{ editing ? 'close' : '$vuetify.icons.edit' }}

    .server-configuration__content
      .server-configuration__content__field
        .server-configuration__content__field__label
          | {{ $t('general.name') }}:
        .server-configuration__content__field__value
          span(v-if="isExistingServer && !editing") {{ server.name }}
          base-text-input.base-text-input--small(
            v-if="!isExistingServer || editing"
            v-model="server.name"
          )

      .server-configuration__content__field
        .server-configuration__content__field__label
          | {{ $t('v2.syslog.organizationLabel') }}:
        .server-configuration__content__field__value
          span(v-if="isExistingServer && !editing") {{ server.organization_name }}
          base-select.base-select--small(
            v-if="!isExistingServer || editing"
            v-model="server.organization"
            :items="organizationOptions"
          )

      .server-configuration__content__field
        .server-configuration__content__field__label
          | {{ $t('v2.syslog.region') }}:
        .server-configuration__content__field__value
          span(v-if="isExistingServer && !editing") {{ $t(`v2.syslog.serverRegionOptions.${server.region}`) }}
          base-select.base-select--small(
            v-if="!isExistingServer || editing"
            v-model="server.region"
            :items="regionOptions"
            :disabled="isExistingServer"
          )

      .server-configuration__content__field
        .server-configuration__content__field__label
          | {{ $t('v2.syslog.dataRetentionPolicy') }}:
        .server-configuration__content__field__value
          span(v-if="isExistingServer && !editing") {{ $t(`v2.syslog.dataRetentionPolicyOptions.${server.data_retention_days}`) }}
          base-select.base-select--small(
            v-if="!isExistingServer || editing"
            v-model="server.data_retention_days"
            :items="dataRetentionPolicyOptions"
          )

</template>

<script>
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseSelect from '@/components/v2/base-select/base-select'
import { mapGetters } from 'vuex'

export default {
  name: 'server-configuration',
  components: { BaseSelect, BaseTextInput },
  props: {
    server: {
      type: Object,
      required: true
    },
    editing: {
      type: Boolean
    },
    isExistingServer: {
      type: Boolean
    },
    isUpdateEnabled: {
      type: Boolean
    }
  },
  data: function () {
    return {
      regions: ['eu-west-1'],
      dataRetentionDays: [1, 7, 15, 30, 45, 60, 90, 180, 270, 365]
    }
  },
  computed: {
    ...mapGetters('layout', ['userWorkspaceOrganizations']),
    organizationOptions () {
      return this.userWorkspaceOrganizations.map(organization => {
        return {
          key: organization.id,
          name: organization.name
        }
      })
    },
    regionOptions () {
      return this.regions.map(region => {
        return {
          key: region,
          name: this.$t(`v2.syslog.serverRegionOptions.${region}`)
        }
      })
    },
    dataRetentionPolicyOptions () {
      return this.dataRetentionDays.map(days => {
        return {
          key: days,
          name: this.$t(`v2.syslog.dataRetentionPolicyOptions.${days}`)
        }
      })
    }
  },
  methods: {
    onEditToggleClick () {
      this.$emit('toggleEditClick')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";
  @import "styles/v2/base.scss";

  .server-configuration {
    &__header {
      height: 38px;
      line-height: 38px;
      padding: 0 14px;
      background-color: $gray-xlight;
      overflow: hidden;
      position: relative;

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

        &__action {
          font-size: 16px;
          margin-top: 7px;
          cursor: pointer;
        }
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
      }
    }
  }
</style>
