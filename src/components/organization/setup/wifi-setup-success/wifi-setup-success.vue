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

<style src="./wifi-setup-success.scss" lang="scss" scoped></style>
