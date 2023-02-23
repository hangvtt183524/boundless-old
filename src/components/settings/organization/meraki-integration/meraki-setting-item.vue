<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.meraki-setting-item(
    :is-set-up="isSetUp"
    :title="$t('v2.organization.settings.merakiConnection')"
    :description="$t('v2.organization.settings.merakiConnectionDescription')"
    :image="imageUrl"
  )
    template(v-slot:actions)
      base-button(
        v-if="!isSetUp"
        class="base-button--green"
        @click="onMerakiConnectClick"
      ) {{ $t('v2.organization.settings.connectToMeraki') }}
      base-button(
        v-if="isSetUp"
        class="base-button--blue--negative"
        @click="onModifyClick"
      ) {{ $t('v2.organization.settings.modify') }}
</template>

<script>
import SettingItem from '../../setting-item.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'meraki-setting-item',
  components: {
    SettingItem,
    BaseButton
  },
  computed: {
    ...mapGetters('layout', ['selectedOrganization']),
    isSetUp () {
      return this.selectedOrganization.is_connected_to_meraki
    },
    imageUrl () {
      return require('@/assets/images/meraki-logo.png')
    }
  },
  methods: {
    onMerakiConnectClick () {
      this.$router.push({ name: 'OrganizationSetupMerakiConnection' })
    },
    onModifyClick () {
      this.$router.push({ name: 'OrganizationSettingsMeraki' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .meraki-setting-item {
    .base-button {
      width: 230px;
    }
  }
</style>
