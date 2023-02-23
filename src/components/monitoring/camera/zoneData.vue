<template lang="pug">
  .zone-data
    .form-card.x3
      v-layout(row)
        v-flex.mb-3(xs12)
          h4.card-title {{ data.label }}
      .main
        v-layout(wrap row)
          v-flex.data-item(xs12)
            .people-count.deemed-blue-text
              img.data-icon(:src="require(`@/assets/images/camera-icons/rate.png`)")
              span.text {{ Math.round((data.conversion_rate || 0) * 100) }}
            .people-label {{ $t('camera.conversionRate') }}
          v-flex.data-item(xs12)
            .people-count.blue-text
              img.data-icon(:src="require(`@/assets/images/camera-icons/enter.png`)")
              span.text {{ data.entrances || 0 }}
            .people-label {{ $t('camera.entrances') }}
          //- v-flex.data-item(xs12)
          //-   .people-count.purple-text
          //-     img.data-icon(:src="require(`@/assets/images/camera-icons/current-people.png`)")
          //-     span.text {{ Math.round(data.average_count || 0) }}
          //-   .people-label {{ $t('camera.averagePeopleInZone') }}
          v-flex.data-item(xs12)
            .people-count.red-text
              img.data-icon(:src="require(`@/assets/images/camera-icons/current-count.png`)")
              span.text {{ data.person || 0 }}
            .people-label {{ $t('camera.currentPeople') }}
</template>

<script>
export default {
  name: 'ZoneData',

  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      cameraData: {
        peopleEntered: 1892,
        currentPeople: 983,
        avgPeople: 120
      }
    }
  }
}
</script>

<style lang="scss">
.zone-data {
  width: 100%;
  .data-item {
    display: flex;
    align-items: center;
    margin-top: 20px;
    &:first-child {
      margin-top: 0;
    }
    .people-count {
      display: flex;
      align-items: center;
        min-width: 80px;
      img {
        width: 15px;
        height: auto;
      }
      span.text {
        padding-left: 15px;
        font-size: 16px;
      }
    }
    .people-label {
      margin-left: 15px;
      font-size: 16px;
    }
  }
}
</style>
