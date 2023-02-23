<template lang="pug">
  .camera-data
    .form-card.x3
      v-layout(row)
        v-flex.mb-3(xs12)
          h4.card-title {{ $t('camera.cameraData') }}
      .main
        v-layout(row)
          v-flex.data-item(xs12 sm6)
            .people-count.blue-text
              img.data-icon(:src="require(`@/assets/images/camera-icons/enter.png`)")
              span.text {{ data.entrances || 0 }}
            .people-label {{ $t('camera.peopleEntered') }}
          v-flex.data-item(xs12 sm6)
            .people-count.purple-text
              img.data-icon(:src="require(`@/assets/images/camera-icons/current-people.png`)")
              span.text {{ data.person || 0 }}
            .people-label {{ $t('camera.currentPeople') }}
          //- v-flex.data-item(xs12 sm4)
          //-   .people-count.deemed-blue-text
          //-     img.data-icon(:src="require(`@/assets/images/camera-icons/check.png`)")
          //-     span.text {{ Math.round(data.average_count || 0) }}
          //-   .people-label {{ $t('camera.averagePeople') }}
</template>

<script>
export default {
  name: 'CameraData',

  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
.camera-data {
  width: 100%;
  .data-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    .people-count {
      display: flex;
      align-items: center;
      img {
        height: 24px;
        width: auto;
      }
      span.text {
        padding-left: 15px;
        font-size: 22px;
      }
    }
    .people-label {
      margin-top: 15px;
      font-size: 16px;
    }
  }
}
</style>
