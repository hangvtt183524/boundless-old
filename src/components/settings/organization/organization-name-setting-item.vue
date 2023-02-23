<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.organization-name-setting-item(
    :is-set-up="null"
    :title="$t('v2.organization.settings.renameOrganizationTitle')"
    :description="$t('v2.organization.settings.renameOrganizationDescription')"
  )
    template(v-slot:actions)
      .organization-name-setting-item__content
        .organization-name-setting-item__organization-name-label(
          v-show="!editing"
        )
          | {{ $t('v2.organization.settings.organizationName') }}:
        span.organization-name-setting-item__organization-name-display(
          v-show="!editing"
        ) {{ selectedOrganization.name }}
      base-text-input(
        v-show="editing"
        v-model="organizationName"
        :placeholder="$t('v2.organization.settings.organizationName')"
      )
      base-button(
        v-show="!editing"
        class="base-button--green--negative"
        @click="onEditTriggerClick"
      ) {{ $t('user.edit') }}
      base-button(
        v-show="editing"
        class="base-button--green"
        @click="onSaveClick"
        :loading="saving"
      ) {{ $t('general.save') }}

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'

import { EventTracker, EVENT_NAMES } from '@/services/event-tracker'

export default {
  name: 'organization-name-setting-item',
  components: {
    BaseButton,
    BaseTextInput,
    SettingItem
  },
  data: function () {
    return {
      editing: false,
      organizationName: null,
      saving: false
    }
  },
  mounted () {
    this.organizationName = this.selectedOrganization.name
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization'])
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        this.organizationName = this.selectedOrganization.name
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization']),
    onEditTriggerClick () {
      this.editing = !this.editing

      if (!this.editing) {
        // Reset organization name
        this.organizationName = this.selectedOrganization.name
      }
    },
    onSaveClick () {
      this.saving = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        name: this.organizationName
      }).then(response => {
        this.editing = false

        global.toastr['success'](this.$t('v2.organization.settings.organizationRenameSuccess'), this.$t('general.success'))
      }).finally(() => {
        this.saving = false
      })

      EventTracker.sendEvent(EVENT_NAMES.ORGANIZATION_RENAMED)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .organization-name-setting-item {

    &__content {
      margin-right: 28px;
      margin-top: 4px;
    }
    &__organization-name-label {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: $text-medium;
    }

    &__organization-name-display {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: $text-medium;
    }

    .base-text-input {
      width: 180px;
      margin-right: 36px;
      display: inline-block;
    }

    .base-button {

    }
  }
</style>
