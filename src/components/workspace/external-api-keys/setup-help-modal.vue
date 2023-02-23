<template lang="pug">
  base-modal(
    class="api-key-setup-help-modal"
    :show="show"
    @close="close"
    max-width="720px"
  )
    template(v-slot:header)
      div.api-key-setup-help-modal__header
        v-layout(row wrap)
          v-flex(xs12)
            div.api-key-setup-help-modal__title
              | {{ $t('v2.organization.settings.merakiApiKey') }}

            v-icon.close-modal(
              @click.stop="close"
            ) close

    template(v-slot:default)
      div.meraki-connection-via-api-help
        v-layout(row wrap)
          v-flex(xs12)
            div.video-container
              iframe(
                src="https://player.vimeo.com/video/383057089"
                frameborder="0"
                allow="fullscreen" allowfullscreen
                class="video-iframe"
              )
          v-flex(xs12).description-column
            div.description-column__content
              div {{ $t('organization.apiKeyHelpFirst') }}
              div {{ $t('organization.apiKeyHelpSecond') }}
</template>

<script>
import BaseModal from '@/components/v2/base-modal/base-modal.vue'
import BaseCard from '@/components/v2/base-card/base-card.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'

export default {
  name: 'api-key-setup-help-modal',
  components: {
    BaseModal,
    BaseCard,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "styles/v2/colors.scss";

.api-key-setup-help-modal {
  position: relative;

  &__title {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 21px;
    line-height: 25px;
    color: $blue-dark;
  }

  &__desctiption {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    color: $text-medium;
  }

  &__content {
    margin-top: 30px;
  }
}

.meraki-connection-via-api-help {
  margin-top: 45px;

  .video-container {
    border: 3px solid $blue-medium;
    box-sizing: border-box;
    border-radius: 6px;
    width: 100%;
    height: 0;
    padding-bottom: 62%;
    position: relative;

    .video-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .description-column {
    &__content {
      height: 100%;
      overflow: hidden;
      position: relative;

      * {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 20px;
        color: $text-medium;
      }
    }
  }
}

@media only screen and (min-width: 960px) {
  .meraki-connection-via-api-help {
    .description-column {
      &__content {
        padding-top: 40px;
      }
    }
  }
}
</style>
