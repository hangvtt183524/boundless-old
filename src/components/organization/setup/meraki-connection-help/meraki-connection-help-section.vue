<template lang="pug">
  .meraki-connection-help-section
    .meraki-connection-help-section__desc
      .meraki-connection-help-section__desc__item
        | {{ $t('organization.apiKeyHelpFirst') }}
      .meraki-connection-help-section__desc__item
        | {{ $t('organization.apiKeyHelpSecond') }}
    .meraki-connection-help-section__actions
      base-button(
        class="base-button--green watch-video-button"
        @click="onWatchVideo"
      ) {{ $t('general.watchVideo') }}
      base-button(
        class="base-button--blue--negative download-doc-button"
        @click="onDownloadClick"
      ) {{ $t('organization.downloadDocumentation') }}

    meraki-connection-help-modal(
      :show="showMerakiConnectionHelpModal"
      @close="closeMerakiConnectionHelpModal"
    )
</template>

<script>
import BaseButton from '@/components/v2/base-button/base-button.vue'
import MerakiConnectionHelpModal from './meraki-connection-help-modal.vue'

export default {
  name: 'setting-item',
  components: {
    BaseButton,
    MerakiConnectionHelpModal
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

  .meraki-connection-help-section {
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
