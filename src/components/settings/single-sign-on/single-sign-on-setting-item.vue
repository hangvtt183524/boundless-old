<template lang="pug" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  setting-item.single-sign-on-setting-item(
    :is-set-up="isSetUp"
    :title="title"
    :description="description"
    :image="image"
  )
    template(v-slot:actions)
      base-button(
        class="base-button--green"
        @click="onAddProviderClick"
      ) {{ $t('v2.organization.settings.configure') }}
</template>

<script>
import SettingItem from '../setting-item.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import CurrentNodeSelectionsMixin from '@/mixins/current-node-selections.mixin'

export default {
  name: 'single-sign-on-setting-item',
  components: {
    SettingItem,
    BaseButton
  },
  mixins: [
    CurrentNodeSelectionsMixin
  ],
  props: {
    provider: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    image: {
      type: String
    }
  },
  computed: {
    rootNode () {
      return this.selectedWorkspace
    },
    isSetUp () {
      return this.rootNode &&
        this.rootNode.identity_providers &&
        this.rootNode.identity_providers.filter(provider => {
          return provider.provider === this.provider
        }).length > 0
    }
  },
  methods: {
    onAddProviderClick () {
      this.$emit('addProviderClick', this.provider)
    }
  }
}
</script>

<style lang="scss" scoped>
  .single-sign-on-setting-item {
    .base-button {
      width: 230px;
    }
  }

  .organization-setting-item ::v-deep {
    .organization-setting-item__actions__visual {
      width: 40px;
    }
  }
</style>
