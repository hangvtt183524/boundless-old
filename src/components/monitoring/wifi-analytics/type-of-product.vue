<template lang="pug">
  .type-of-product
    .form-card.x2
      v-layout(row wrap)
        v-flex.chart-root-container(xs12 md6 sm6)
          v-layout.row-container(column)
            v-flex.mb-5(x12)
              h4 {{  type === 'os' ? $t(' monitoring.typeOfOS ') :  $t(' monitoring.typeOfDevice ') }}
            .type-row(
              v-for="(label, index) in labels"
              :key="label"
            )
              .label-container
                v-icon {{ icons[index] }}
                span.small-label.pl-3 {{ labels[index] }}
              .color-badge(
                :style="'background-color: ' + colors[index]"
              )
              span.item-count.px-1 {{ data[index].count || 0 }}
        v-flex.chart-root-container(xs12 md6 sm6)
          .chart-container
            pie-chart(
              :data="chartData"
            )
          .hidden-div
          .chart-bg(
            :style="'background-image: url(' + bgImg + ');'"
          )
</template>

<script>
import PieChart from '@/components/common/pie-chart.js'
import iconArray from '@/utils/fontawesome-array'
export default {
  name: 'TypeOfDevice',
  props: ['type', 'data', 'bgImg'],
  components: {
    PieChart
  },
  methods: {

  },
  mounted () {
  },

  watch: {
    chartData (v) {}
  },

  computed: {
    chartData () {
      if (this.type === 'os') {
        return {
          datasets: [{
            data: this.sortedData.filter(item => item.operation_system !== 'unknown').map(item => item.count),
            backgroundColor: this.colors
          }],
          labels: this.sortedData.filter(item => item.operation_system !== 'unknown').map(v => `${v.percentage}%`)
        }
      }

      return {
        datasets: [{
          data: this.sortedData.filter(item => item.device_type !== 'unknown').map(item => item.count),
          backgroundColor: this.colors
        }],
        labels: this.sortedData.filter(item => item.device_type !== 'unknown').map(v => `${v.percentage}%`)
      }
    },
    labels () {
      if (this.type === 'os') {
        return this.sortedData.filter(item => item.operation_system !== 'unknown').map(item => item.operation_system)
      } else {
        return this.sortedData.filter(item => item.device_type !== 'unknown').map(item => item.device_type)
      }
    },
    icons () {
      return this.labels.map(label => iconArray.find(icon => icon.text === label).icon || '')
    },
    sortedData () {
      // eslint-disable-next-line
      return this.data.sort((a, b) => {
        let nameA = ''
        let nameB = ''
        if (this.type === 'os') {
          nameA = a.operation_system.toUpperCase() // ignore upper and lowercase
          nameB = b.operation_system.toUpperCase() // ignore upper and lowercase
        } else {
          nameA = a.device_type.toUpperCase() // ignore upper and lowercase
          nameB = b.device_type.toUpperCase() // ignore upper and lowercase
        }
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        // names must be equal
        return 0
      })
    }
  },
  data () {
    return {
      colors: ['#4b83f0', '#62d862', '#aa85d9', '#354c77', '#00ffd9']
    }
  }
}
</script>

<style lang="scss">
@import "styles/colors.scss";

.monitoring-page .type-of-product {
  width: 100%;

  .chart-bg {
    position: absolute;
    background-size: cover;
    height: 5.334em;
    width: 5.334em;
    right: 3.9em;
    border-radius: 50%;
  }
  .chart-root-container {
    position: relative;
    padding: 0;
  }
  .chart-container {
    position: absolute;
    max-width: 16.67em;;
    max-height: 16.67em;;
    right: 0;
    margin: -0.57em -1.77em 0 0;
    @media (max-width: 767px) {
      display: none;
    }
  }
  .form-card {
    padding-top: 0;
    padding-bottom: 0;
  }
  .color-badge {
    width: 30px;
    height: 5px;
    border-radius: 5px;
    background: red;
  }
  .item-count {
    color: $blue;
    font-weight: bold;
    margin-right: 10px;
    width: 40px;
    @media (max-width: 767px) {
      padding-left: 12px !important;
    }
  }
  .v-icon {
    width: 50%;
    font-size: 1.334em;
  }
  .hidden-div {
    position: absolute;
    top: 0;
    width: 103%;
    height: 3.1em;
    background: white;
    z-index: 1;
    @media (max-width: 1440px) {
      width: 110%;
      height: 3.3em;
    }
    @media (max-width: 1440px) {
      width: 100%;
    }
    @media (max-width: 767px) {
      display: none;
    }
  }
  .type-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    max-width: 16.67em;;
    margin-bottom: 0.8em;
    @media (max-width: 767px) {
      max-width: unset;
    }
  }
  .row-container {
    padding: 30px 0;
  }
  .label-container {
    display: flex;
    width: 8em;
    @media (max-width: 767px) {
      flex: 1;
    }
  }
  .small-label {
    color: $deemed-gray;
  }

  @media (min-width: 1440px) {
    .chart-bg {
      top: 7.1em;
    }
  }

  @media (max-width: 1440px) {
    .chart-bg {
      top: 7.3em;
    }
  }

  @media (max-width: 1320px) {
    .chart-bg {
      top: 7.4em;
    }
  }

  @media (max-width: 767px) {
    .chart-bg {
      display: none;
    }
  }
}

</style>
