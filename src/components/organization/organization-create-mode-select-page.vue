<template lang="pug">
  div.organization-create-mode-select-page
    div.organization-create-mode-select-page__header
      v-layout(row wrap)
        v-flex(xs12)
          base-tab-header(
            :class="['tab-header--blue tab-header--underlined', {'tab-header--active': true}]"
          ) {{ $t('general.setup') }}

    div.organization-create-mode-select-page__content
      div.organization-create-mode-select-page__content__tab.setup-mode-tab

        v-layout(row wrap)
          v-flex(xs12)
            div.organization-create-mode-select-page__content__description
              | {{ $t('organization.organizationSetupDescription') }}

        v-layout(row wrap)
          v-flex(xs12)
            base-card(
              :title="$t('organization.quickSetup')"
              :text="$t('organization.quickSetupDescription')"
              v-model="setupMode"
              :card-value="setupModeOptions.quick"
              class="base-card--horizontal"
            )
              template(
                v-slot:additionContent
              )
                .cisco-meraki-logo-container
                  img(src="@/assets/images/meraki-logo.png")

        v-layout(row wrap)
          v-flex(xs12)
            base-card(
              :title="$t('organization.manualSetup')"
              :text="$t('organization.manualSetupDescription')"
              v-model="setupMode"
              :card-value="setupModeOptions.manual"
              class="base-card--horizontal"
            )

        v-layout(row wrap)
          v-flex(xs12)
            base-button(
              class="base-button--green"
              :disabled="setupMode === null"
              @click="onNextClick"
            ) {{ $t('general.next') }}

</template>

<script>
import BaseCard from '@/components/v2/base-card/base-card.vue'
import BaseButton from '@/components/v2/base-button/base-button.vue'
import BaseTabHeader from '@/components/v2/base-tab-header/base-tab-header.vue'

export default {
  name: 'organization-setup-mode',
  components: {
    BaseCard,
    BaseButton,
    BaseTabHeader
  },
  data: function () {
    return {
      setupModeOptions: {
        quick: 'quick',
        manual: 'manual'
      },
      setupMode: null
    }
  },
  methods: {
    onNextClick () {
      if (!this.setupMode) {
        return false
      }

      if (this.setupMode === this.setupModeOptions.quick) {
        this.$router.push({ name: 'CreateOrganizationQuick' })
      } else {
        this.$router.push({ name: 'CreateOrganizationManual' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/v2/colors";

.organization-create-mode-select-page {
  width: 100%;
  background-color: $white;

  &__header {
    height: 59px;
    padding: 0 60px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    user-select: none;
  }

  &__content {
    padding: 30px 56px;

    &__title {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 21px;
      line-height: 25px;
      color: $blue-dark;
    }

    &__description {
      font-family: Fira Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;
      color: $text-medium;
      margin-bottom: 20px;
    }

    .base-card {
      position: relative;
      margin-bottom: 15px;
      width: 100%;
      max-width: 640px;
    }

    .base-card ::v-deep {
      .cisco-meraki-logo-container {
        position: absolute;
        right: 2px;
        top: 2px;
        border-radius: 3px;
        padding: 31px 23px 31px 32px;
        background: #F0F0F0;
        img {
          width: 86px;
          height: 17px;
        }
      }
    }
    .base-card--selected ::v-deep {
      .cisco-meraki-logo-container {
        background: #1E3153;
      }
    }
  }
}
</style>
