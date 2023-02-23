<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.ale-configuration-setting-item(
    :is-set-up="isSetUp"
    :title="$t('v2.organization.settings.aleConfigurationTitle')"
    :description="$t('v2.organization.settings.aleConfigurationDescription')"
    :loading="loading"
    :editing="editing"
    :image="imageUrl"
  )
    template(v-slot:actions)
      base-button(
        v-show="editing === false"
        class="base-button--green ale-configuration-setting-item__setup-trigger"
        @click="onSetupClick"
      ) {{ $t('v2.organization.settings.setupConfiguration') }}
      base-button(
        v-show="editing === true"
        class="base-button--green"
        @click="onSaveClick"
        :disabled="!isValueChanged || !isValid"
      ) {{ $t('general.save') }}
      base-button(
        v-show="editing === true"
        class="base-button--blue--negative"
        @click="onCancelClick"
      ) {{ $t('general.cancel') }}

    template(v-slot:content)
      base-text-input.base-text-input--multiline(
        v-model="newAleId"
        placeholder="00:00:00:00:00:00"
        :label="$t('v2.organization.settings.newAleId')"
        :validations="aleIdValidations"
      )

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SettingItem from '../setting-item.vue'
import BaseTextInput from '@/components/v2/base-text-input/base-text-input'
import BaseButton from '@/components/v2/base-button/base-button'
import { isValidMacAddress } from '@/utils/form-fields-validation-rules'

export default {
  name: 'ale-configuration-setting-item',
  components: {
    BaseButton,
    BaseTextInput,
    SettingItem
  },
  data: function () {
    return {
      editing: false,
      newAleId: null,
      loading: false,
      aleIdValidations: {
        required: true,
        methods: [{
          method: isValidMacAddress
        }]
      }
    }
  },
  mounted () {
    this.resetAleId()
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isSetUp () {
      return this.selectedOrganization && this.selectedOrganization.aruba_ale_ids && this.selectedOrganization.aruba_ale_ids.length > 0
    },
    isValueChanged () {
      if (this.isSetUp) {
        return this.newAleId !== this.selectedOrganization.aruba_ale_ids[0].aruba_ale_id
      } else {
        return this.newAleId !== '' && this.newAleId !== null
      }
    },
    isValid () {
      return this.newAleId && isValidMacAddress(this.newAleId)
    },
    imageUrl () {
      return require('@/assets/images/aruba-logo.png')
    }
  },
  watch: {
    selectedOrganization: {
      handler: function () {
        this.resetAleId()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('organization', ['updateOrganization']),
    onSetupClick () {
      this.editing = true
    },
    onSaveClick () {
      this.loading = true
      this.updateOrganization({
        id: this.selectedOrganization.id,
        aruba_ale_ids: [{
          aruba_ale_id: this.newAleId
        }]
      }).then(response => {
        this.editing = false
      }).finally(() => {
        this.loading = false
      })
    },
    onCancelClick () {
      this.editing = false

      // Reset new ALE id
      this.resetAleId()
    },
    resetAleId () {
      if (this.isSetUp) {
        this.newAleId = this.selectedOrganization.aruba_ale_ids[0].aruba_ale_id
      } else {
        this.newAleId = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .ale-configuration-setting-item {
    &__setup-trigger {
      width: 230px;
    }

    .base-button:not(:first-child) {
      margin-left: 10px;
    }

    .base-text-input {
      max-width: 270px;
    }
  }
</style>
