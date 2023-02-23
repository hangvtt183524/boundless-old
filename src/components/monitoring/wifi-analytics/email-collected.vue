<template lang="pug">
  .email-collected
    .form-card.x3
      v-layout(row)
        v-flex.mb-3(xs12)
          h4.card-title {{ $t('monitoring.emailsCollected') }}
      .main
        span.large {{ value }}
        p.medium {{ $t('monitoring.emailsCollected') }}
      .img-container
        img.mail-box(:src="require(`@/assets/images/mailbox.png`)")
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  name: 'EmailCollected'
}
</script>

<style lang="scss">
@import "styles/colors.scss";

.email-collected {
  width: 100%;

  .main {
    width: 162px;
    height: 154px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding-top: 20px;
    border: 1px solid #9BA9C4;
    border-radius: 50%;
  }
  .img-container {
    position: relative;
    width: 100%;
    text-align: center;
    left: 0;
    background: #FFF;
    margin-top: -15px;
    img.mail-box {
      margin-top: -30px;
    }
  }
  .large {
    color: $purple;
    font-size: 36px;
    font-weight: 600;
  }
  .medium {
    color: $purple;
    font-size: 14px;
  }
}

</style>
