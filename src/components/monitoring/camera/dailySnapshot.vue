<template lang="pug">
  .daily-snapshot
    .form-card.x3
      v-layout(row)
        v-flex.mb-3(xs12)
          h4.card-title {{ $t('camera.dailySnapshot') }}
      .main
        VueApexCharts(
          :options="options"
          :height="200"
          :series="series"
        )
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'DailySnapshot',

  components: {
    VueApexCharts
  },

  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data () {
    return {
      options: {
        chart: {
          id: 'daily-snapshot-chart',
          foreColor: '#000',
          type: 'bar'
        },
        colors: ['#AA85D9'],
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '30%'
          }
        },
        tooltip: {
          enabled: false
        },
        xaxis: {
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true
          }
        }
      },
      series: [{
        name: 'hours',
        data: []
      }]
    }
  },

  watch: {
    'data' (value) {
      this.series[0].data = []
      const updatedData = value.map((item, index) => {
        const hour = this.$moment().set('hour', item.hour)
        return {
          x: `${hour.format('HH')}:00`,
          y: item.entrances
        }
      })

      this.series = [
        {
          name: 'hours',
          data: updatedData
        }
      ]
    }
  }
}
</script>

<style lang="scss">

.daily-snapshot {
  width: 100%;
}

</style>
