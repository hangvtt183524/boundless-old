<template lang="pug">
  v-dialog.base-dialog(
    v-model="value"
    content-class="deleting-org"
    width="536"
    persistent
  )
    grid-loader(:loading="true" color="#15AC2F" class="loading-spinner")
    h2.dialog-heading {{ headingText ? headingText : $t('organization.deletingOrganization') }}
    .deleting-progress-desc1 {{ descriptionText ? descriptionText : $t('organization.deletingOrganizationLabel') }}
    .deleting-progress-desc2 {{ $t('general.waitMoment') }}
</template>

<script>
import BaseDialog from '@/components/common/base-dialog'
import GridLoader from 'vue-spinner/src/GridLoader.vue'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    headingText: {
      type: String,
      required: false
    },
    descriptionText: {
      type: String,
      required: false
    }
  },
  components: {
    BaseDialog,
    GridLoader
  }
}
</script>
<style lang="scss" scoped>
  @import "styles/v2/colors.scss";

  .loading-spinner {
    margin: 0 auto;
    padding-top: 34px;
  }
  .dialog-heading {
    margin-top: 54px;
    text-align: center;
    font-style: normal;
    font-weight: normal;
    font-size: 30px;
    line-height: 26px;
    letter-spacing: 0.5px;
    color: #223D70;
  }
  .deleting-progress-desc1,
  .deleting-progress-desc2 {
    font-family: Fira Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 25px;
    text-align: center;
    color: $text-medium;
  }
  .deleting-progress-desc1 {
    margin-top: 23px;
  }
  .deleting-progress-desc2 {
    margin-bottom: 45px;
  }
</style>
