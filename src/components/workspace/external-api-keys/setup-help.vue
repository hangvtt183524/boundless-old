<template lang="pug">
  .api-key-setup-help
    .api-key-setup-help__desc
      .api-key-setup-help__desc__item
        | {{ $t('organization.apiKeyHelpFirst') }}
      .api-key-setup-help__desc__item
        | {{ $t('organization.apiKeyHelpSecond') }}
    .api-key-setup-help__actions
      base-button(
        class="base-button--green watch-video-button"
        @click="onWatchVideo"
      ) {{ $t('general.watchVideo') }}
      base-button(
        class="base-button--blue--negative download-doc-button"
        @click="onDownloadClick"
      ) {{ $t('organization.downloadDocumentation') }}

    api-key-setup-help-modal(
      :show="showMerakiConnectionHelpModal"
      @close="closeMerakiConnectionHelpModal"
    )
</template>

<script>
import BaseButton from '@/components/v2/base-button/base-button.vue'
import ApiKeySetupHelpModal from './setup-help-modal'

export default {
  name: 'setting-item',
  components: {
    BaseButton,
    ApiKeySetupHelpModal
  },
  data () {
    return {
      showMerakiConnectionHelpModal: false
    }
  },
  methods: {
    closeMerakiConnectionHelpModal () {
      this.showMerakiConnectionHelpModal = false
    },
    onWatchVideo () {
      this.showMerakiConnectionHelpModal = true
    },
    onDownloadClick () {
      const path = 'https://docs.google.com/document/d/1aBcLRcshUWjbVIaBe7v31IerAzqyRBa3Yweng_E1TwQ/preview'
      window.open(path)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .api-key-setup-help {
    padding: 25px 0;
    position: relative;

    &__desc {
      display: inline-block;

      &__item {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 20px;
        color: $text-medium;
      }
    }

    &__actions {
      float: right;
      margin-right: 30px;

      .watch-video-button {
        width: 208px;
        margin-right: 16px;
      }
      .download-doc-button {
        width: 238px;
      }
    }
  }

</style>
