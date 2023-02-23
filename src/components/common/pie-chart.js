import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['data'],
  name: 'PieChart',
  mounted () {
    this.renderData()

    window.addEventListener('resize', this.renderData)
  },
  computed: {
    chartOptions () {
      return {
        cutoutPercentage: 85,
        aspectRatio: 1,
        // legend: {
        //   display: false
        // },
        pieceLabel: {
          render: 'label',
          // arc: true,
          fontColor: this.initialData.datasets[0].backgroundColor,
          fontSize: 15,
          position: 'outside',
          outsidePadding: 4
        },
        tooltips: {
          enabled: false
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        responsive: true
      }
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.renderData)
  },
  methods: {
    renderData () {
      if (this.prevClientWidth === window.innerWidth) return

      this.renderChart(this.initialData, this.chartOptions)
      this.prevClientWidth = window.innerWidth
    }
  },
  data () {
    return {
      initialData: this.data, // just acts like wrapper
      prevClientWidth: 0
    }
  }
}
