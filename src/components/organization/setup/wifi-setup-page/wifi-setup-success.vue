<template lang="pug">
  div.wifi-setup-success
    div.wifi-setup-success__header
      img.wifi-setup-success__header__success-visual(
        src="@/assets/images/check-icon.png"
      )
      div.wifi-setup-success__header__text-container
        div.wifi-setup-success__header__success-title
          | {{ $t('general.success') }}!
        div.wifi-setup-success__header__success-description
          p {{ $t('organization.wifiSetupSuccessDescriptionFirst') }}
          p {{ $t('organization.wifiSetupSuccessDescriptionSecond') }}

</template>

<script>

export default {
  name: 'wifi-setup-success'
}
</script>

<style lang="scss" scoped>
  @import "../../../../styles/v2/colors";

  .wifi-setup-success {
    background-color: $white;
    text-align: center;
    overflow: hidden;

    &__header {
      overflow: hidden;
      margin-top: 70px;

      &__success-visual {
        width: 30px;
      }

      &__text-container {
        max-width: 360px;
        margin: 20px auto;
      }

      &__success-title {
        font-family: Fira Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 26px;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      &__success-description {
        border-top: 4px solid $gray-medium;
        margin-top: 32px;
        padding-top: 48px;

        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        color: $text-medium;

        p {
          margin-top: 20px;
        }
      }
    }
  }

</style>
